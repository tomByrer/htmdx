<p align="center">
  <img alt="HTMDX logo" src="./htmdx.svg" width="100" />
</p>

# HTMDX: Lightweight runtime for mdx-like markdown

This library is an attempt to provide a runtime to compile [mdx](https://github.com/mdx-js/mdx)-like markdown files (with the goal to support full JSX inside of markdown) using [htm](https://github.com/developit/htm) + [marked](https://github.com/markedjs/marked) that is much smalled in file-size as opposed to the official runtime (which we are not encouraged to use on actual websites).

[Here is a simple example application using HTMDX](https://michael-klein.github.io/htmdx/example/dist/index.html)

## Usage

Simple example:

```javascript
import * as React from "react";
import * as ReactDOM from "react-dom";
import { htmdx } from "htmdx";

function SomeComponent() {
  return "something";
}

const markDownWithJSX = `
  # Hello World

  <SomeComponent />

  Mardown will be interpreted as tagged templates from htm:
  <input type="text" style=\${{width: '100%'}} value=\${"Editing this will console.log the value"} onChange=\${e => console.log(e.target.value)}/>

  With the transformJSXToHTM option enabled, you may also use normal brackets:
  <input type="text" style={{width: '100%'}} value={"Editing this will console.log the value too"} onChange={e => console.log(e.target.value)}/>

function SomeComponent() {
  return "Some component ouput.";
}

ReactDOM.render(
  htmdx(
    markDownWithJSX,
    React.createElement, // provide a h function. You can also use HTMDX with preact or any other library that supports the format
    {
      components: { SomeComponent }, // provide components that will be available in markdown files,
      configureMarked: marked => // configure the underlying marked parser, e.x.: to add code highlighting:
          marked.setOptions({
            highlight: function(code) {
              return Prism.highlight(
                code,
                Prism.languages.javascript,
                'javascript'
              ).replace(/\n/g, '<br/>');
            },
          }),
      transformJSXToHTM: true // transforms some JSX to htm template literal syntax (such as value={} to value=${})
    }
  ),
  document.getElementById("root")
);
```

[![Edit htmdx example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/romantic-liskov-m4x35?fontsize=14&hidenavigation=1&theme=dark)
