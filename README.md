# FullContact.js

An effortless interface for [FullContact](http://www.fullcontact.com/), using node-request.

# Install

In terminal:

    npm install fullcontact.js

# Usage

In your JavaScript:

	var FullContact = require('fullcontact.js')
	  , fc = new FullContact('your_api_key');

	function your_callback(response) {
		// handle returned data
	}

	fc.person({email: 'garbados@gmail.com'}, your_callback);

The `response` param given to your callback is a JavaScript object built by parsing the JSON returned by FullContact. So, a simple callback might be:

	function simple_callback(response) {
		console.log(response.status); // prints the response code your call returned.
	}

# FullContact API Documentation

Check out FullContact's documentation [here](http://www.fullcontact.com/developer/docs/).

# Tests

To run the test suite, then do this after installing the library:

    npm test fullcontact.js your_api_key

If you entered a valid API key as a command-line argument, the tests should (as of this writing) pass. They pass silently, so if you run the tests and nothing prints, you're good.