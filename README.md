#Bellhop#

Bellhop is a simple event-based communication layer between the page DOM and an iframe. It doesn't require any additional dependencies. The minified version of the library is less than 4K. Super easy to use and setup. 

## Installation

Install can be done with Bower:

```bash
bower install bellhop
```

##Basic Usage##

Here's a very simple example to get started. We have two pages `index.html` and `child.html`.This is the minimum you need to start get them talking to each other.

###Contents of `index.html`###

```html
<iframe src="child.html" id="page" width="200" height="200"></iframe>
<script>

	// Create the bellhop object
	var bellhop = new Bellhop();

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

###Contents of `child.html`###

```html
<script>

	// Create the bellhop object
	var bellhop = new Bellhop();
	bellhop.connect();

	if (bellhop.supported)
	{
		// Cannot connect to parent page probably
		// because we aren't within an iframe
	}
	else
	{
		// An example event to sent to the parent
		bellhop.send('init');

		// Handle events from the parent
		bellhop.on('user', function(event){

			// Capture the data from the event
			var user = event.data;
		});
	}

</script>
```

##Documentation##

See the [documentation](http://cloudkidstudio.github.io/Bellhop) for more detailed information about the API. 

##License##

Copyright (c) 2014 [CloudKid](http://github.com/cloudkidstudio)

Released under the MIT License.