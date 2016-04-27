
var facebook_client_id = '1677423189189016';
var facebook_client_secret = '9e9e60395b6d7ac9ad5e7847faa214bd';
var facebook_callback_url = 'http://localhost:3000/auth/facebook/callback';

module.exports = {
    'clientID'      : facebook_client_id , // your App ID
    'clientSecret'  : facebook_client_secret, // your App Secret
    'callbackURL'   : facebook_callback_url,
    'redirect_uri'  : facebook_callback_url
}
