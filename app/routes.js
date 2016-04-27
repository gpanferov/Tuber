// app/routes.js
var api = require('./api.js');
var User = require('./models/user.js')
module.exports = function(app, passport) {
    // landing page
    app.get('/', function(req, res) {
        if (isAuthenticated(req)) {
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
                    res.render('tuber.ejs', {
                        user: req.user,
                        tutors: users
                    })
                }
            })
        } else {
            res.render('index.ejs'); // load the index.ejs file
        }
    });
    app.get('/test', isLoggedIn, function(req, res) {
        res.render('test.ejs', {
            user: req.user
        })
    })
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
      scope : ['email']
    }));
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        scope : ['email'],
        successRedirect: '/test',
        failureRedirect: '/'
    }),
    function(err,req,res,next) {
        // You could put your own behavior in here, fx: you could force auth again...
        // res.redirect('/auth/facebook/');
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    }

    );
    /*************PROTECTED ROUTES *****************/
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/users', isLoggedIn, function(req, res) {
        // return users json
    });
    app.get('/user/:id', isLoggedIn, function(req, res) {
        // return one user
    });
    app.put('/users/:id', isLoggedIn, function(req, res) {});
    app.get('/classes', isLoggedIn, function(req, res) {});
    /***This is used for our api for our mobile devices****/
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isAuthenticated(req) {
    if (req.isAuthenticated()) {
        return true
    }
    return false
}
