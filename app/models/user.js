// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : { type : String, unique : true},
        username     : { type : String, unique : true},
        password     : { type : String },
        first        : { type : String },
        last         : { type : String }
    },
    facebook         : {
        id           : String,
        token        : String,
        firstName    : String,
        lastName     : String,
        email        : String,
        gender       : String
    },
    phone        : { type : String },
    birthday     : { type : String },
    token     : { type : String, unique : true },
    classes   : [ String ],
    ratings   : [ Number ],
    avgRating : Number,
    isTutor   : { type : Boolean, default : false },
    isAdmin   : { type : Boolean, default : false },
    picUrl    : String,
    gender    : String,
    bio : { type : String },
    created_at  : Date,
    update_at   : Date,
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
