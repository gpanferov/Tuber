// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : { type : String, unique : true, required : true},
        username     : { type : String, unique : true, required : true},
        password     : { type : String, required : true},
        first        : { type : String },
        last         : { type : String },
        phone        : { type : String },
        birthday     : { type : String }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    token   : { type : String, unique : true },
    classes : [ String ],
    ratings  : [ Number ],
    avgRating : Number,
    isTutor : { type : Boolean, default : false },
    isAdmin : { type : Boolean, default : false },
    bio : { type : String }
});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
