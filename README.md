<p align="center">
  <img alt="HTMDX logo" src="./htmdx.svg" width="100" />
</p>

# HTMDX: Lightweight runtime for mdx-like markdown

<img alt="build badge" src="https://github.com/michael-klein/htmdx/workflows/CI/badge.svg" /> [<img alt="npm" src="https://img.shields.io/npm/v/htmdx">](https://www.npmjs.com/package/htmdx)

This library is an attempt to provide a runtime to compile [mdx](https://github.com/mdx-js/mdx)-like markdown files (with the goal to support full JSX inside of markdown) using [htm](https://github.com/developit/htm) + [marked](https://github.com/markedjs/marked) that is much smaller in file-size as opposed to the official runtime (which we are not encouraged to use on actual websites).

[Here is a simple example playground using HTMDX](https://michael-klein.github.io/htmdx/example/dist/index.html)

## Usage

Simple example:

```javascript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { htmdx } from 'htmdx';
import * as Prism from 'prismjs';

function SomeComponent() {
  return 'something';
}

const markDownWithJSX = `
  # Hello World

  <SomeComponent />

  Mardown will be interpreted as tagged templates from htm:
  <input type="text" style=\${{width: '100%'}} value=\${this.state.inputValue || ''} onChange=\${e => {this.setState({inputValue:e.target.value});console.log(e.target.value)}}/>
  We're also using the setState method and state property passed into using the thisValue options (see below)

  With the transformJSXToHTM option enabled, you may also use normal brackets:
  <input type="text" style={{width: '100%'}} value={this.state.inputValue || ''} onChange={e => this.setState({inputValue:e.target.value})}/>
  
  Here's some code with code highlighting:
  \`\`\`
  function SomeComponent() {
    return "Some component ouput.";
  }
  \`\`\`
`;

function App() {
  const [state, setState] = React.useState({});

  return htmdx(
    markDownWithJSX,
    React.createElement, // provide a h function. You can also use HTMDX with preact or any other library that supports the format
    {
      components: { SomeComponent }, // provide components that will be available in markdown files,
      configureMarked: (
        marked // configure the underlying marked parser, e.x.: to add code highlighting:
      ) =>
        marked.setOptions({
          highlight: function(code) {
            return Prism.highlight(
              code,
              Prism.languages.javascript,
              'javascript'
            ).replace(/\n/g, '<br/>');
          },
        }),
      transformClassToClassname: true, // transforms class="some-class" to className="some-class" (default: true)
      transformJSXToHTM: true, // transforms some JSX to htm template literal syntax (such as value={} to value=${}) (default: true)
      thisValue: {
        // the this value passed to the compiled JSX
        state,
        setState: newState => setState(Object.assign({}, state, newState)),
      },
    }
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

[![Edit htmdx example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/romantic-liskov-m4x35?fontsize=14&hidenavigation=1&theme=dark)

### Pluggable MDX transforms

You can supply MDX transforms, which will be applied to mdx strings before anything else:

```javascript
htmdx('# Hello World', React.createElement, {
  mdxTransforms: [m => m.replace('# Hello World', '# foo')], // will replace # Hello world with # foo
})
```

### Pluggable JSX transforms

You can supply JSX transforms which allow you to apply further transforms before the JSX pragma runs, like so:

```javascript
htmdx('# Hello World', React.createElement, {
  jsxTransforms: [
    (props, type, children) => {
      if (children && children[0] === 'Hello World') {
        children[0] = 'Foo'; // this will output <h1>Foo</h1> instead of <h1>Hello World</h1> now!
      }
      return [props, type, children];
    },
  ],
})
```

### Overwriting normal generated html elements with components:

You can also provide components for basic html elements that are generated by the markdown compiler:

```javascript
htmdx("# Hello World", React.createElement, {
  components: {
    TestComponent,
    h1: props =>
      html`
        <h1 style=${{ color: 'red' }}>${props.children}</h1>
      `,
  }
})
```
