
var facebook_client_id = '1677423189189016';
var facebook_client_secret = '9e9e60395b6d7ac9ad5e7847faa214bd';
var facebook_callback_url = 'http://tuber.tech/auth/facebook/callback';

var fb_id = "1677501949181140";
var fb_secret = "539d8fb1d4c9462a19a02c3988ef98fc";
var fb_callback = 'http://localhost:3000/auth/facebook/callback'

module.exports = {
    'clientID'      : fb_id || facebook_client_id , // your App ID
    'clientSecret'  : fb_secret || facebook_client_secret, // your App Secret
    'callbackURL'   : fb_callback || facebook_callback_url
}
