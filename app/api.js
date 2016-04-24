var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var User = require('./models/user.js');
var Class = require('./models/class.js');

var api = express.Router()
var jwt_secret = require('../config/auth.js').jwt_secret


api.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

api.get('/', function(req, res){
  res.json({
    'Welcome' : 'To our api bby'
  })
})

api.post('/authenticate', function(req, res) {

    var password = req.body.password || req.query.password;
    var username = req.body.username || req.query.username;

    console.log(username)
    console.log(password);

    User.findOne({ "local.username" : username } , function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user && validPassword(password, user)) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect username/password"
                });
            }
        }
    });
});

api.post('/signin', function(req, res) {

    var password = req.body.password || req.query.password;
    var username = req.body.username || req.query.username;

    User.findOne({"local.username" : username }, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }
        else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            }
            else {
                var userModel = new User();
                userModel.local.email = req.body.email ||  req.query.email;
                userModel.local.password = generateHash(password)
                userModel.local.username = req.body.username || req.query.username;
                userModel.local.first = req.body.first || req.query.first;
                userModel.local.last = req.body.last || req.query.last;
                userModel.local.birthday = req.body.birthday || req.query.birthday;


                userModel.save(function(err, user){
                  if (err){
                    console.log(err)
                  }
                  user.token = jwt.sign( {_id : user._id}, jwt_secret);
                  console.log(user.token)
                  user.save(function(err, user1){
                    if (err){
                      console.log(err)
                    }
                    res.json({
                      type  : true,
                      data  : user1,
                      token : user1.token
                    })
                  })
                })

            }
        }
    });
});

api.get('/profile', ensureAuthorized, function(req, res) {

  console.log(req.headers)

    User.findOne({token: req.headers['authorization']}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});


api.get('/tutors', ensureAuthorized, function(req, res){


});

api.get('/classes', ensureAuthorized, function(req, res){

})


api.post('/profile', ensureAuthorized, function(req, res){

  var email = null || req.query.email || req.body.email;
  var username = null || req.query.username || req.body.username;
  var password = null || req.query.password || req.body.password;
  var first = null || req.query.first || req.body.first;
  var last = null || req.query.last || req.body.last;
  var phone = null || req.query.phone || req.body.phone;
  var birthday = null || req.query.birthday || req.body.birthday;
  var classes = null || req.query.classes || req.body.classes
  var rating = null || req.query.rating || req.body.rating

  User.findOne({token : req.headers['authorization']}, function(err, user){
    if (err){
      console.log(err)
      res.json({
        type : false,
        data : "Error occured " + err
      })
    }
    else {
      if (email){
        user.local.email = email;
      }
      if (username){
        user.local.username = username;
      }
      if (password){
        user.local.password = generateHash(password)
        //update hash here
      }
      if (first){
        user.local.first = first;
      }
      if (last){
        user.local.last = last;
      }
      if (phone){
        user.local.phone = phone;
      }
      if (birthday){
        user.local.birthday = birthday
      }
      if(classes){
        user.classes = user.classes.push(classes)
      }
      if (rating){
        user.rating = user.rating.push(rating)
      }

      user.save(function(err, user){
        if (err){
          console.log(err)
          res.json({
            data : 'Error occured ' + err
          })
        }
        else {
          res.json({
            message : 'successfully updated user'
          })
        }
      })
    }

  })
})


function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});

function generateHash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
function validPassword(password, user){
  return bcrypt.compareSync(password, user.local.password)
}


module.exports = api;
