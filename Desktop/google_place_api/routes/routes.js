require('dotenv').load();
const passport = require('passport');
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const GooglePlaces = require('googleplaces');
const places = new GooglePlaces(apiKey, 'json');
const User = require('../models/user.js').User;
const Club = require('../models/user.js').Club;

module.exports = function(app){

	app.get('/', function(req, res){
		res.render('index', {club: null});
	});

	// app.get('/search', function(req, res){
	// 	let searchClub = 'club in ' + req.query.query;
	// 	places.textSearch({query: searchClub}, function(error, result){
	// 		res.render('index', {club: result.results,
	// 							apiKey: apiKey,
	// 							user: req.user});
	// 	})
	// });


	app.get('/search', function(req, res){
		if(!req.query.query){
			res.redirect('/');
		}else{
			let searchClub = 'club in ' + req.query.query;
			places.textSearch({query: searchClub}, function(error, result){
				if(error) throw error;
				for(let i = 0; i < result.results.length; i++){
					Club.findOne({placeid: result.results[i].id}, function(err, data){
						if(err) throw err;
						if(!data){
							let newClub = new Club();
							newClub.placeid = result.results[i].id;
							newClub.save(function(err){
								if(err) throw err;
							});
						}
					})
				}
				res.render('index', {club: result.results,
									apiKey: apiKey,
									user: req.user});
			})
		}
	});



	app.post('/going', isLoggedIn, function(req, res){
		Club.findOne({placeid: req.body.id}, function(err, result){
			console.log(result);
			if(err) throw err;
			if(!result.peopleid.length){
				result.peopleid.push(res.locals.user);
				result.save(function(err){
					if(err) throw err;
					console.log('push')
					res.json(result);
				})
			}else{
				Club.update({placeid: req.body.id}, {$pull: {peopleid : { _id : res.locals.user._id}}}, function(err, data){
					if(err) throw err;
					console.log('pull')
					res.json(null);
				})
			}
		})
	})


	app.get('/facebook', passport.authenticate('facebook'));

	app.get('/facebook/callback', passport.authenticate('facebook',{ 
		successReturnToOrRedirect: 'back',
		failureRedirect: '/',
		failureFlash: true
	}));


}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/facebook');
}
