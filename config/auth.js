var facebook_client_id = '1677423189189016';
var facebook_client_secret = '9e9e60395b6d7ac9ad5e7847faa214bd';
var facebook_callback_url = 'http://localhost:3000/auth/facebook/callback';

module.exports = {
  jwt_secret : 'tubersecret',

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
