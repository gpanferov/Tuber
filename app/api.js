var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var User = require('./models/user.js');
var Class = require('./models/class.js');

var api = express.Router()
var jwt_secret = require('../config/auth.js').jwt_secret

process.on('uncaughtException', function(err) {
    console.log(err);
});

api.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

api.get('/', function(req, res){
  res.render('api.ejs', {user : req.user})
})

api.post('/authenticate', function(req, res) {

    console.log(req.headers);
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
                userModel.local.phone = req.body.phone || req.query.phone;


                userModel.save(function(err, user){
                  if (err){
                    console.log(err)
                    res.json({'Error saving user' : err})
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

  //console.log(req.headers)

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

  User.find({ isTutor : true }, function(err, users){
    if(err){
      console.log(err)
      res.json({
        data : 'Error ' + err
      })
    }
    else {
      res.json({ users })
    }
  })
});

api.get('/classes', ensureAuthorized, function(req, res){

  var title = req.body.title || req.query.title;
  var category = req.body.title || req.query.title;

  if (title){
    Class.find({title : title}, function(err, classes){
      if (err){
        console.log(err)
        res.json({ data : 'Error ' + err })
      }
      else {
        res.json({ classes })
      }
    })
  }
  else if (category){
    Class.find({ category : category }, function(err, classes){
      if (err){
        console.log(err)
        res.json({ data : 'Error ' + err })
      }
      else {
        res.json({ classes })
      }
    })
  }
  else if (title && category){
    Class.find({title : title, category : category}, function(err, classes){
      if (err){
        console.log(err)
        res.json({ data : 'Error ' + err })
      }
      else {
        res.json({ classes })
      }
    })
  }
  else {
    Class.find({}, function(err, classes){
      if (err){
        console.log(err)
        res.json({ data : 'Error ' + err })
      }
      else {
        res.json({ classes })
      }
    })
  }
})


api.post('/classes', function(req, res){
  if (!userIsAdmin(req)){
    res.json({data : "You are not authenticated to access this page"})
  }
  else {
    var title = req.body.title || req.query.title;
    var category = req.body.title || req.query.title;

    if (title && category){
      var newClass = Class.new();
      newClass.title = title;
      newClass.category = category;
      newClass.save(function(err, classs){
        if (err){
          console.log(err)
          res.json({ data : "Error " + err })
        }
        else {
          res.json({data : "successfully created class!"})
        }
      })
    }
    else {
      res.json({data : "Error, not enough data to create class"})
    }
  }
})

api.post('/classes/:id', function(req, res){
  if (!userIsAdmin(req)){
    res.json({data : "You are not authenticated to access this page"})
  }

})

api.delete('/classes/:id', function(req, res){
  if (!userIsAdmin(req)){
    res.json({data : "You are not authenticated to access this page"})
  }
})

api.post('/profile', ensureAuthorized, function(req, res){

  var email = null || req.query.email || req.body.email;
  var username = null || req.query.username || req.body.username;
  var password = null || req.query.password || req.body.password;
  var first = null || req.query.first || req.body.first;
  var last = null || req.query.last || req.body.last;
  var phone = null || req.query.phone || req.body.phone;
  var birthday = null || req.query.birthday || req.body.birthday;
  var classes = null || req.query.classes || req.body.classes;
  var rating = null || req.query.rating || req.body.rating;

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
        user.local.email = email.toString()
      }
      if (username){
        user.local.username = username.toString()
      }
      if (password){
        user.local.password = generateHash(password)
        //update hash here
      }
      if (first){
        user.local.first = first.toString()
      }
      if (last){
        user.local.last = last.toString()
      }
      if (phone){
        user.local.phone = phone.toString()
      }
      if (birthday){
        user.local.birthday = birthday.toString()
      }
      if(classes){
        console.log("The classes are ", classes)
        user.classes.push(classes.toString())
        user.isTutor = true
      }
      if (rating){
        user.ratings.push(rating);
        user.avgRating = computeAverage(user.ratings);
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

api.get('/profile/:id', ensureAuthorized, function(req, res){
  console.log(req.params)
  User.findOne({ _id : req.params.id}, function(err, user){
    if (err){
      console.log(err)
      res.json({data : "Error " + err})
    }
    else {
      res.json({data : user})
    }
  })
})

api.post('/profile/:id', ensureAuthorized, function(req, res){
  var rating = req.query.rating || req.body.rating;
  User.findOne({_id : req.params.id}, function(err, user){
    if(err){
      console.log(err);
      res.json({'data' : err})
    }
    else {
      user.ratings.push(rating);
      user.avgRating = computeAverage(user.ratings);
      user.save(function(err, user){
        if (err){
          console.log(err)
          res.json({'data' : "There was an error saving the user"})
        }
        else {
          res.json({'data' : 'successfully saved ratingt'})
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

function generateHash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}


function validPassword(password, user){
  return bcrypt.compareSync(password, user.local.password)
}

function computeAverage(numbers){
  var num = 0;
  for (var i = 0; i < numbers.length; i++){
    num += numbers[i]
  }
  return (num/numbers.length)
}

function userIsAdmin(req){
  User.findOne({ token : req.headers['authorization']}, function(err, user){
    if (err){
      console.log(err)
      res.json({data : "Error " + err})
    }
    else {
      if (user.isAdmin){
        return true
      }
      return false
    }
  })
}

module.exports = api;
