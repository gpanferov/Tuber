// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var User = require('./user.js');

var message = String;
var owner = String;

var chatMessage = {owner : message};

// define the schema for our user model
var chatSchema = mongoose.Schema({
  participants = [ User ],
  chat  = [ chatMessage ]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Chat', chatSchema);
