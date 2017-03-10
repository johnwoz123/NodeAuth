//configuration to setup passport
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local Strategy
const localOptions = { usernameField: 'email'};
const locallogin = new LocalStrategy(localOptions, function(email, password, done) {
  //after the LocalStrategy parses the request in the callback it hands us email password
  //Verify this username and password, call done with email and password
  //if it is the correct email and password
  //otherwise call done and false
  //
  //findById - is looking at all the users with that email
  //the function is the callback either return the user or the error
  User.findOne({
    email: email
  }, function (err, user) {
    if(err){
      return done(err);
    }
    if(!user) {
      done(null, false);
    }

    //compare passwords - is this-password (in args) = user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});



//set up optiosn for JWT Strategy
const jwtOptions = {
  jwtFromRequest:ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret

};

//Create JWT Strategy
//payload - decoded jwt token
//done - callback function we need to call depending if we authenticate or not
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //function called whenever a user is trying to login with a jwt -authenticate

  //see if the user id in the payload exsists in the db if so, call done with that user otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if(err){
      //err is the error false is the user object - meaning not found
      return done(err, false);
    }
    if(user) {
      //no error and found a user
      done(null,user);
    }else{
      //no error but no user was found
      done(null,false);
    }
  });
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(locallogin);
