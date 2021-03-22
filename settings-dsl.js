/* outputs svelte */
let { lex, parse, Keyword, TextNode } = require('./parser.js')

function findChildKeyword(node, ident) {
    return node.children.find(child => child instanceof Keyword && child.ident === ident);
}

// emit is for compiler warnings to be shown 

function Compiler(emit=console.log) {
    let id = 0;
    function renderQuestionFromType(type, node) {
        let our_id = id++;
        let onchange = (() => {
            // oninput fire as soon as change, do not wait for blur
            let saveTo = findChildKeyword(node, "saveTo");
            if (saveTo === undefined) {
                emit("weak-warning", node, "Missing *saveTo, data entered into question is ignored");
                return "";
            } else {
                // TODO: Save to config and change relvant Svelte variables
                return ' oninput=""';
            }
        })();
        // TODO: Read defaults from config
        let forInputType = type => '<label for="' + our_id + '">' + node.data +
                '</label><input type="' + type + '" id="' + our_id + '"' + onchange + '></input>';
        if (type === "color") {
            return forInputType("color");
        } else if (type === "text") {
            return forInputType("text")
        }
        emit("warning", node, "unsupported question type")
    }
    function renderNode(node) {
        // TODO: escape text and add seperate html keyword
        if (node instanceof TextNode) {
            return '<p>' + node.text + '</p>'
        } else if (node instanceof Keyword) {
            if (node.ident === "heading") {
                return '<h1>' + node.data + '</h1>'
            } else if (node.ident === "list") {
                if (node.data === "expandable") {
                    return '<details>' + ''.concat(...node.children.map(renderNode)) + '</details>'
                } else emit("warning", node, "unsupported list type")
            } else if (node.ident === "question") {
                // find the question type
                let foundChild = findChildKeyword(node, "type");
                let questionType = foundChild == null ? "radio" : foundChild.data;
                return '<div class="question">' + renderQuestionFromType(questionType, node) + '</div>'
            }
            emit("warning", node, "unsupported keyword")
        }
    }
    return renderNode;
}
function makeThemeMaker(s) {
    let nodes = parse(lex(s));
    let compiler = Compiler();
    return '<!doctype html><html lang=en>' + ''.concat(...nodes.map(compiler)) + '</html>';
}
const fs = require('fs')
console.log(makeThemeMaker(fs.readFileSync('./thememaker.gt', 'utf8')))
