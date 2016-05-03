// app/routes.js

'use strict';


var api = require('./api.js');
var User = require('./models/user.js');
var helper = require('./helperFunctions.js')


module.exports = function(app, passport) {
    // landing page
    app.get('/', function(req, res) {
        if (helper.isAuthenticated(req)) {
            User.find({
                "isTutor": true
            }, function(err, users) {
                if (err) {
                    console.log('No tutors available')
                    res.render('tuber.ejs', {
                        user: req.user,
                        tutors: null
                    })
                } else {
                    var tutor_array = helper.chunkify(users, Math.round(Math.sqrt(users.length)), true );
                    console.log(tutor_array)
                    res.render('tuber.ejs', {
                        user: req.user,
                        tutors: tutor_array
                    })
                }
            })
        }
        else {
            res.render('index.ejs', {user : null}); // load the index.ejs file
        }
    });

    app.get('/get-started', function(req, res){
      if (helper.isAuthenticated(req)){
        res.redirect('/')
      }
      else {
        res.render('get-started')
      }
    }, helper.catchErrors)
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    }, helper.catchErrors);
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }), helper.catchErrors);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash message
    }), helper.catchErrors);
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
      scope : ['email']
    }), helper.catchErrors);
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        scope : ['email'],
        successRedirect: '/',
        failureRedirect: '/'
    }), helper.catchErrors );
    /***************** PROTECTED ROUTES *****************/
    app.get('/profile', helper.isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    }, helper.catchErrors);
    app.get('/create-class', helper.isLoggedIn, helper.isAdmin, function(req, res){
      res.render('create-class.ejs');
    });

    app.get('/users', helper.isLoggedIn, function(req, res) {
        // TODO return users json
    });
    app.put('/users/:id', helper.isLoggedIn, function(req, res) {
      // TODO return one user
    });
    app.get('/classes', helper.isLoggedIn, function(req, res) {
      // TODO return all classes to be browsed
    });
    app.get('/classes/:id', helper.isLoggedIn, function(req, res){
      // TODO return all tutors for that class
    });

    app.get('/tutors/:id', helper.isLoggedIn, function(req, res){
      // TODO return a tutor's profile
    });

    /**CHAT ROUTES**/
    app.use('/chat', helper.isLoggedIn, require('./chatRoutes.js'))
    /***This is used for our api for our mobile devices****/
};
