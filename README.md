![signature](http://tuber.tech/images/tuber.png)


#**_Uber but for Tutors_**

Tuber is a "tutor on demand" application for those who are looking to tutor and be tutored. 

###REST API
We created our own REST API for communication between the server and all 3 platforms we are running: iOS, Android, and Web.
The Rest API was created using node.js, express.js and mongodb. This allowed us to rapidly create and consume our own API.

[Documentation can be found here](http://tuber.tech/api).

###Tokens
To allow user authenticationwe we decided to use tokens instead of a cookies.
A token is a string that is sent to the browser after the server authenticates their login.
This token is then stored within the HTTP header which allows the user to stay logged for as long as they please.
Because of this we were able to implement a truly RESTful API.

###iOS
We had to setup multiple viewcontrollers for the App. One managing each different page (login, create a user, settings, reviews, profiles, list of tutors).
All of these were connected in the storyboard through segues.
Most of the pages would send an HTTP 'get' request when opening in order to gather the information that needs to be displayed from the server.
Some pages were listening for user input before doing an HTTP 'post' request to the server providing information for the action being accomplished (login, new user, add a class...)
'Login' and 'create user' both send a post form to the server and get a token in return. This token is then saved and is used everytime the app tries to reconnect to the same account.

A few things that were a bit hard to implement:
- Converting the Data back from the server into usable data
- Displaying all the tutors on the tutor page
- Saving the token for later use (even if the app is closed)
- Getting the layouts right

###Android
We were successful in creating a user friendly UI for the Android. A few things we had a hard time with when working with Android:
- Converting the Json file to the objects we needed.
- Making the dynamic scrolling list was tough because of the limitations of code we knew, so we had to learn a lot of code to be able implement that

###Web
We created and consumed our own api. For the web development we used

- Passport.js for authentication
- express.js for simplifying http requests
- ejs as our templating language
- Material Design from google as the front end framework
- bcrypt for hashing passwords

On the web app you are only able to sign in, sign up, view profile, edit profile, view tutors and log out. 

###TODO:
The following features will be rolling out in subsequent months
- Geo-Location for a Lyft & Uber like UI
- Socket.io to enable chat between users
- Payments between users

#Licensing
The following source code (i.e. this entire repository) is under a dual license.

####Commercial

If you plan on using this as a "template" for your own gain (*yes, your refers to companies, corporations, etc*), you must contact me
(jruel006@ucr.edu) in order to purchase a license.

Copyright (C) Juan G. Ruelas Jr, Maxime Moison, Gene Panferov, Mohit Veligenti - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Juan G. Ruelas Jr. <jruel006@ucr.edu>, April 2016
 *

####Open Source
If you plan on genuinely helping others connect and don't plan on making any profit (this means you __cannot__ make profit at all), then
you can freely copy and modify, however you must share any and all changes. Any questions can be directed at jruel006@ucr.edu

#REMEMBER

__Licenses are not contracts: the work's user is obliged to remain within the bounds of the license not because he/she voluntarily
promised, but because she doesn't have any right to act at all except as the license permits.__ Meaning, you cannot make a profit from
this project unless the core developers are involved and recieve proper attribution/compensation.
