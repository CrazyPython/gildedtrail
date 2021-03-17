# GildedTrail v0.0.1
A metalanguage for defining configurations for building simple applications

Example code:
```
Theme maker
    *question: What color should the player's own color be?
        *type: color
    *question: Do you want to apply the theme now?
        Apply the theme now
            Let's go then
        Save it under a name
            *goto save_under_name
```

Lexed and parsed:
```json
[
  {
    "text": "Theme maker",
    "children": [
      {
        "ident": "question",
        "data": "What color should the player's own color be?",
        "children": [
          {
            "ident": "type",
            "data": "color",
            "children": []
          }
        ]
      },
      {
        "ident": "question",
        "data": "Do you want to apply the theme now?",
        "children": [
          {
            "text": "Apply the theme now",
            "children": [
              {
                "text": "Let's go then",
                "children": []
              }
            ]
          },
          {
            "text": "Save it under a name",
            "children": [
              {
                "ident": "goto",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "text": "",
    "children": []
  },
  {
    "text": "",
    "children": []
  }
]
```

Lexes and parses [GuidedTrack](https://www.guidedtrack.com/) syntax

### Documentation
`node instanceof Keyword` - check if a node is a keyword

`node instanceof TextNode` - check if a node is a text node

## License
LGPLv3 or any later version.

If you are building an open-source GuidedTrack alternative or reimplementation, I reccomend you license under AGPLv3 to protect user rights and prevent GuidedTrack from stealing your code. GuidedTrack generates its code on the server-side, so without the AGPLv3, they could use your software to make a proprietary version.
