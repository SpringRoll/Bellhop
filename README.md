# Bellhop [![Build Status](https://travis-ci.org/SpringRoll/Bellhop.svg?branch=master)](https://travis-ci.org/SpringRoll/Bellhop) [![Dependency Status](https://david-dm.org/SpringRoll/Bellhop.svg?style=flat)](https://david-dm.org/SpringRoll/Bellhop)

Bellhop is a simple event-based communication layer between the page DOM and an iframe. It doesn't require any additional dependencies. Super easy to use and setup.

## Installation

```bash
npm install bellhop-iframe
```

## Importing Bellhop
The Bellhop module contains support for ES6 modules, CommonJS and browser global definitions. To import with ES6,

```javascript
import { Bellhop } from 'bellhop-iframe';
```

To import with CommonJS, refer instead to the UMD build

```javascript
const Bellhop = require('bellhop-iframe/dist/bellhop-umd.js');
```
You can also import the UMD version by using import
```javascript
import 'bellhop-iframe/dist/bellhop-umd.js';
```

Lastly, the UMD module can also be directly included on an HTML page. This will declare Bellhop and attach it directly
to `window`
```html
<script src="node_modules/bellhop-iframe/dist/bellhop-umd.js"></script>
```

## Basic Usage ##

Here's a very simple example to get started. We have two pages `index.html` and `child.html`.This is the minimum you need to start get them talking to each other.

### Contents of `index.html` ###

```html
<iframe src="child.html" id="page" width="200" height="200"></iframe>
<script>

// Create the bellhop object
const bellhop = new Bellhop();

// Pass in the iframe DOM object
bellhop.connect(document.getElementById("page"));

// Listen for the 'init' event from the iframe
bellhop.on('init', function(event){
  // Handle the event here!
});

// Send data to the iframe
bellhop.send('user', {
  "name" : "Dave Smith",
  "age" : 16,
  "city" : "Boston"
});
</script>
```

### Contents of `child.html` ###

```html
<script>

// Create the bellhop object
const bellhop = new Bellhop();
bellhop.connect();

// An example event to sent to the parent
bellhop.send('init');

// Handle events from the parent
bellhop.on('user', function(event){
  // Capture the data from the event
  const user = event.data;
}
</script>
```

## Available Methods

### `new Bellhop`
The constructor creates a new `Bellhop` instance, taking an optional unique identifier for this instance. If no id is provided, a random one is selected

### `connect`
Connects a `Bellhop` instance to an iframe, or it's containing window. For instance, given a `Bellhop` instance `bellhop`:

```javascript
bellhop.connect();
```

will connect a child iframe to it's parent, allowing it to emit messages _out_ of the iframe. However,

```javascript
var iframe = document.querySelector('iframe');
bellhop.connect(iframe);
```

allows a containing page to connect with an interior iframe and emit message _into_ the iframe.

### `destroy`
`disconnect` removes any listener for events from another frame, and stops listening for messages altogether

### `send`
Sends a named message to another iframe:

```javascript
bellhop.send('newHighscore', { value: 100 });
```

### `fetch` and `respond`
Convenience methods for automating response of values between the interior and exterior of frames. For instance:

```javascript
// parent.html
var iframe = document.querySelector('iframe');
var bellhop = new Bellhop(iframe);
bellhop.connect();
bellhop.respond('config', { difficulty: 'hard', theme: 'dark' });


// child.html
var bellhop = new Bellhop();
bellhop.connect();
bellhop.fetch('config', function(result) {
  console.log(result); // { difficulty: 'hard', theme: 'dark' }
});
```

### `target`
Property for retrieving the iframe element through which this `Bellhop` instance is communicating:

```javascript
var iframe = document.querySelector('iframe');
var bellhop = new Bellhop(iframe);

console.log(bellhop.target === iframe.contentWindow); // true
```

## License ##

Copyright (c) 2018 [Springroll](https://github.com/SpringRoll)

Released under the MIT License.
