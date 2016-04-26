var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var auth = require('./auth.js')
var jwt = require('jsonwebtoken');
var User = require('../app/models/user');
// expose this function to our app using module.exports
module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'local.email': email
            }, function(err, user) {
                // if there are any errors, return the error
                if (err) return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.username = req.body.username
                        // save the user
                    newUser.save(function(err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            user.token = jwt.sign({
                                _id: user._id
                            }, auth.jwt_secret);
                            user.save(function(err, user1) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    return
                                    done(null, newUser);
                                }
                            })
                        }
                    });
                }
            });
        });
    }));
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        console.log("WE IN NIGGA")
        User.findOne({
            'local.username': email
        }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) return done(err);
            // if no user is found, return the message
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            // if the user is found but the password is wrong
            if (!user.validPassword(password)) return
            done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });
    }));
    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            passReqToCallback: true,
            clientID: auth.facebookAuth.clientID,
            clientSecret: auth.facebookAuth.clientSecret,
            callbackURL: auth.facebookAuth.callbackURL,
            profileFields: ['id', 'emails']
        },
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            console.log("WE IN NIGGA BITCH");
            console.log("PROFILE: ", profile)
            console.log("TOKEN: ", refreshToken)
            // asynchronous
            process.nextTick(function() {
                // find the user in the database based on their facebook id

                if (!profile){
                  console.log("Facebook did not give us your profile");
                  return done(profile)
                }
                if (profile){
                  console.log("THE GIVEN PROFILE IS ", profile)
                }

                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err) {
                        console.log("Error " + err);
                        return done(err);
                    }
                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    }

                    else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();
                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err) {
                                console.log("Error" + err)
                                throw err;
                            }
                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};
