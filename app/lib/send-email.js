//This actually does send emails. There is some sort of error that occurs after sending the email (something about attaching further headers)
//but the callback function fn does still work and the email does go out.
'use strict';

var request = require('request');

module.exports = function(req, res, args, fn){
  var key = process.env.MAILGUN;
  if (key === undefined){
    throw new Error('The MAILGUN variable has not been defined in the shell. Please edit your bash profile or define MAILGUN at runtime as equal to your Mailgun API key.');
  }
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandbox25341.mailgun.org/messages';
    //note: change last part of that URL to your Mailgun domain
    //also, make sure you are using the API key associated with that URL
    //if either are incorrect then sending the email will fail silently
    //TODO: consider specifying the URL as an environment variable as well
  console.log(url);
  var post = request.post(url, function(err, response, body){
    //fn();
  });
  var form = post.form();
  for (var prop in args){               // This loops through everything we passed in as args...
    console.log('Appending: ', prop, ' with args: ', args[prop]);
    form.append(prop, args[prop]);      // and automatically appends it to the email...
  }                                     // instead of requiring us to hardcode what will be present in the email.
  fn();
};
