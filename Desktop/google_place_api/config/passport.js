const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.js').User;
const configAuth = require('./auth');

module.exports = function(passport){


	passport.serializeUser(function(user, done){
		done(null, user.id);
	})

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	})

	passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    profileFields: ['id', 'displayName', 'email'],
	    passReqToCallback: true
	  },
	function(req, accessToken, refreshToken, profile, done) {
	  	process.nextTick(function(){
	  		if(!req.user){
	  			User.findOne({'facebook.id' : profile.id}, function(err, user){
		  			let newUser = new User();
		  			newUser.facebook.id = profile.id;
		  			newUser.facebook.name = profile.displayName;
		  			newUser.facebook.email = profile.emails[0].value;
		  			
		  			newUser.save(function(err){
		  				if(err) throw err;
		  				return done(null, newUser);
		  			})
	  			})
	  		}else{
	  			let user = req.user;
	  			return done(null, user);
	  		}
	  	})
	}));

};