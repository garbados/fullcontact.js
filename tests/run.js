var api_key = process.argv[2]
  , FullContact = require('../main.js')
  , assert = require('assert');

var fc = new FullContact(api_key);

function generate_assertion(statusCode) {
	return function(response) {
		try {
			assert.equal(response.status, statusCode);
		} catch(e) {
			console.log(response.request);
			throw e;
		}

	}
}

var test_callbacks = {
	'OK': 			generate_assertion(200),
	'Accepted': 	generate_assertion(202),
	'Bad Request': 	generate_assertion(400),
	'Forbidden': 	generate_assertion(403),
	'Not Found': 	generate_assertion(404),
	'Invalid': 		generate_assertion(422)
};

var test_params = {
	person: {email: 'garbados@gmail.com'},
	name: {q: 'Mr. John (Johnny) Michael Smith CPA'},
	location: {place: 'Denver, CO'},
	email: {email: 'joe+tag@sharklasers.com'},
};

// test_params['batch'] = (function() {
// 	requests = [];
// 	for(key in test_params){
// 		requests.push(fc['batch_'+key](test_params[key]));
// 	}
// 	return {requests: requests};
// })();

var tests = {
	forbidden: function() {
		for(key in test_params) {
			var bad_params = {apiKey: 'herp derp'};
			for (var attrname in test_params[key]) { 
				bad_params[attrname] = test_params[key][attrname];
			}
			fc[key](bad_params, 
				test_callbacks['Forbidden'])
		}
	},
	invalid: function() {
		for(key in test_params) {
			fc[key]({}, 
				test_callbacks['Invalid'])
		}
	},
	goodrequest: function() {
		for(key in test_params) {
			fc[key](test_params[key], 
				test_callbacks['OK'])
		}
	},
}

// run the dang things!
for(key in tests) {
	tests[key]();
}