var request = require('request');

function FullContact(apiKey) {
	this.apiKey = apiKey;
	this.urls = {
		person: 'https://api.fullcontact.com/v2/person.json',
		name: 'https://api.fullcontact.com/v2/name/normalizer.json',
		location: 'https://api.fullcontact.com/v2/address/locationNormalizer.json',
		// icon: 'https://api.fullcontact.com/v2/icon/',
		batch: 'https://api.fullcontact.com/v2/batch.json',
		// cardshark: 'https://api.fullcontact.com/v2/cardShark',
		email: 'https://api.fullcontact.com/v2/email/disposable.json',
	};
}

FullContact.prototype._get = function(urlKey) {
	return function(options, cb) {
		if (!hasOwnProperty(options, 'apiKey')) {
			options.apiKey = this.apiKey;
		}
		request({
			url: this.urls[urlKey],
			qs: options
		}, cb);	
	}
}

FullContact.prototype.person = FullContact.prototype._get('person');
FullContact.prototype.name = FullContact.prototype._get('name');
FullContact.prototype.location = FullContact.prototype._get('location');
FullContact.prototype.batch = FullContact.prototype._get('batch');
FullContact.prototype.email = FullContact.prototype._get('email');

module.exports = FullContact;