// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var classSchema = mongoose.Schema({
  title : { type : String, required : true },
  category : { type : String, required : true }
});

module.exports = mongoose.model('Class', classSchema);
