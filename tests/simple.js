var apiKey = process.argv[2]
  , FullContact = require('../main.js')
  , fc = new FullContact(apiKey);

fc.person({email:'garbados@gmail.com'}, function(){console.log(arguments);})