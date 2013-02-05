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
	var urls = {};
	for (var attrname in complex_urls) { 
		urls[attrname] = complex_urls[attrname];
	}
	for (var attrname in fc_urls) {
		urls[attrname] = fc_urls[attrname];
	}
	return urls;
})();

// this pattern is like `def __init__`, right?
function FullContact(apiKey) {
	this.apiKey = apiKey;

	for(url in fc_urls) {
		this[url] = this._get(url);
		this['batch_'+url] = this._batch(url);
	}
}

FullContact.prototype.urls = all_urls;

FullContact.prototype.get_body = function(callback) {
	return function(error, response, body) {
		callback(JSON.parse(body));
	}
}

// generates functions to call FullContact generically
FullContact.prototype._get = function(urlKey) {
	_self = this;
	var getfunc = function(options, cb) {
		options.apiKey = options.apiKey || _self.apiKey;
		request({
			url: _self.urls[urlKey],
			qs: options
		}, function(e,r,b){
			if(b && (JSON.parse(b).status === 202)){
				setTimeout(getfunc, 300000, options, cb);
			}else{
				_self.get_body(cb)(e,r,b);
			}
		});
	}
	return getfunc;
}

// generate functions to format, but not execute, FullContact queries. Useful for batch.
FullContact.prototype._batch = function(urlKey) {
	return function(options) {
		return url_js.format({
			query: options,
			host: this.urls[urlKey]
		});
	}
}

// special method: batch
// FullContact.prototype.batch = function(options, cb) {
// 	var apiKey = options.apiKey || this.apiKey;
// 	delete options.apiKey;
// 	request.post({
// 		url: this.urls['batch'],
// 		qs: {apiKey: apiKey},
// 		json: options
// 	}, cb);
// }

module.exports = FullContact;