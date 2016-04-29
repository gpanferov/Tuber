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

                    var tutor_array = chunkify(users, Math.round(Math.sqrt(users.length)), true );
                    console.log(tutor_array)
                    res.render('tuber.ejs', {
                        user: req.user,
                        tutors: tutor_array
                    })
                }
            })
        } else {
            res.render('index.ejs', {user : null}); // load the index.ejs file
        }
    });

    app.get('/map', function(req, res){
      res.render('map')
    });

    app.get('/get-started', function(req, res){
      if (isAuthenticated(req)){
        res.redirect('/')
      }
      else {
        res.render('get-started')
      }
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
        successRedirect: '/',
        failureRedirect: '/'
    }),
    function(err,req,res,next) {
          // You could put your own behavior in here, fx: you could force auth again...
          // res.redirect('/auth/facebook/');
          if(err) {
              console.log(err)
          }
          res.redirect('/');
      }
    );
    /***************** PROTECTED ROUTES *****************/
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/create-class', isLoggedIn, isAdmin, function(req, res){
      res.render('create-class.ejs');
    })

    app.get('/chat/:id', function(req, res){
      // TODO create a chatroom
    })

    app.get('/chat', isLoggedIn, function(req, res){
      // TODO view all chats
    })

    app.get('/users', isLoggedIn, function(req, res) {
        // TODO return users json
    });
    app.get('/user/:id', isLoggedIn, function(req, res) {
        // TODO return one user
    });
    app.put('/users/:id', isLoggedIn, function(req, res) {
      // TODO return one user
    });
    app.get('/classes', isLoggedIn, function(req, res) {
      // TODO return all classes to be browsed
    });
    app.get('/classes/:id', isLoggedIn, function(req, res){
      // TODO return all tutors for that class
    });

    app.get('/tutors/:id', isLoggedIn, function(req, res){
      // TODO return a tutor's profile
    })

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

function isAdmin(req, res, next){

  console.log(req.user)
  if (req.user.isAdmin){
    return next()
  }
  res.redirect('/');
}

function chunkify(a, n, balanced) {

    if (n < 2)
        return [a];

    var len = a.length,
            out = [],
            i = 0,
            size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
    }
    return out;
}
