var User = require('./models/user.js');

module.exports = {

  /*****************************************************/
  test : function(){
    console.log('test')
  },

  /*****************************************************/
  isLoggedIn : function(req, res, next){
      // if user is authenticated in the session, carry on
      if (req.isAuthenticated()) {
        return next();
      }
      // if they aren't redirect them to the home page
      res.redirect('/');
  },
  /*****************************************************/
  chunkify : function (a, n, balanced){
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
  },
  /*****************************************************/
  isAuthenticated : function(req){
    if (req.isAuthenticated()) {
        return true
    }
    return false
  },
  /*****************************************************/
  isAdmin : function(req,res, next){
    console.log(req.user)
    if (req.user.isAdmin){
      return next()
    }
    res.redirect('/');
  },
  /*****************************************************/
  catchErrors : function(err, req, res, next){
    if(err) {
        console.log(err)
    }
    res.redirect('/');
  }



}
