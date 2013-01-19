var request = require('request')
  , url_js = require('url');

var fc_urls = {
	person: 'https://api.fullcontact.com/v2/person.json',
	name: 'https://api.fullcontact.com/v2/name/normalizer.json',
	location: 'https://api.fullcontact.com/v2/address/locationNormalizer.json',
	email: 'https://api.fullcontact.com/v2/email/disposable.json',
};

// urls with special needs
var complex_urls = {
	batch: 'https://api.fullcontact.com/v2/batch.json',
	// cardshark: 'https://api.fullcontact.com/v2/cardShark',
	// icon: 'https://api.fullcontact.com/v2/icon/',
}

// dynamically merge urls
var all_urls = (function() {
	urls = fc_urls;
	for (var attrname in complex_urls) { 
		urls[attrname] = complex_urls[attrname];
	}
	return urls;
})();

// generates functions to call FullContact generically
var _get = function(self, urlKey) {
	return function(options, cb) {
		console.log(self.apiKey); // TODO why is this undefined?
		options.apiKey = options.apiKey || self.apiKey;
		request({
			url: self.urls[urlKey],
			qs: options
		}, cb);	
	}
}

// generate functions to format, but not execute, FullContact queries. Useful for batch.
var _batch = function(self, urlKey) {
	return function(options) {
		return url_js.format({
			query: options,
			host: self.urls[urlKey]
		});
	}
}

// this pattern is like `def __init__`, right?
function FullContact(apiKey) {
	this.apiKey = apiKey;
	this.urls = all_urls;

	for(url in fc_urls) {
		this[url] = _get(this, url);
		this['batch_'+url] = _batch(this, url)
	}

	this.batch = function(options, cb) {
		var apiKey = options.apiKey || this.apiKey;
		delete options.apiKey;
		request({
			url: this.urls['batch'],
			form: options
		}, cb);
	}
}

module.exports = FullContact;