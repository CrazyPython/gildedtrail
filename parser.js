const INDENT = '\t'
const START_BLOCK = '\0'
const END_BLOCK = '\1'
function countAtStart(s, char) {
    let count = 0;
    for (let c of s) {
        if (c === char) {
            count++;
        } else break;
    }
    return count;
}
function lexAndParse(s) {
    let lexed = lex(s);
    return parse(lexed)
}
function lex(s) {
    // Remove comments
    let newString = '';
    for (let line of s.split('\n')) {
        newString += line.replace(/--.*/, "") + '\n';
    }
    // Emit indentation tokens
    let indentationLevel = 0;
    let resultString = '';
    for (let line of newString.split('\n')) {
        let nTabs = countAtStart(line, INDENT);
        let cleanLine = line.slice(nTabs);
        if (nTabs === indentationLevel) {
            resultString += cleanLine + '\n';
        } else if (nTabs === indentationLevel + 1) {
            resultString += START_BLOCK + '\n' + cleanLine + '\n';
            indentationLevel++;
        } else if (nTabs < indentationLevel) {
            for (; nTabs < indentationLevel; indentationLevel--) {
                resultString += END_BLOCK + '\n';
            }
            resultString += cleanLine + '\n';
        } else {
            console.log(nTabs, cleanLine, indentationLevel)
            throw new Error("Line is overindented");
        }
    }
    return resultString;
}
// console.assert(lex("a\n\tb") == ("a\n" + START_BLOCK + "\nb\n" + END_BLOCK + '\n'));
Array.prototype.last = function () {
    return this[this.length - 1]
}
function Keyword(ident, data) {
    this.ident = ident;
    this.data = data;
    this.children = []
}
function TextNode(text) {
    this.text = text;
    this.children = [];
}
function ArrowedStatement(text) {
    this.data = text;
}
function parse(s) {
    let stack = [[]];
    // console.log(s.split('\n'))
    for (let line of s.split('\n')) {
        if (line[0] === '*') {
            let [, ident, data] = line.slice(1).match('([a-zA-Z0-9]+)(?:[ \t\f\v]*:[ \t\f\v]*(.+))?')
            let newKeyword = new Keyword(ident, data);
            stack.last().push(new Keyword(ident, data));
        } else if (line[0] === '>' && line[1] === '>') {
            let text = line.slice(2);
            stack.last().push(new ArrowedStatement(text));
        } else if (line[0] === START_BLOCK) {
            stack.push(stack.last().last().children);
        } else if (line[0] === END_BLOCK) {
            stack.pop();
        } else {
            // TODO: Add {variable} support, text node should be an array
            stack.last().push(new TextNode(line));
        }
    }
    return stack[0];
}
module.exports = {
    parse,
    lex,
    Keyword,
    TextNode,
}
/*console.log(JSON.stringify(
lexAndParse(`Theme maker
	*question: What color should the player's own color be?
		*type: color
	*question: Do you want to apply the theme now?
		Apply the theme now
			Let's go then
		Save it under a name
			*goto save_under_name`)
))*/
