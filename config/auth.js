var facebook_client_id = process.env.FB_ID;
var facebook_client_secret = process.env.FB_SECRET;
var facebook_callback_url = process.env.FB_CALLBACK_URL;

module.exports = {
  jwt_secret : 'tubersecret',

  auth : {

    'facebookAuth' : {
        'clientID'      : facebook_client_id , // your App ID
        'clientSecret'  : facebook_client_secret, // your App Secret
        'callbackURL'   : facebook_callback_url
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

  }
}
