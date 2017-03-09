require('dotenv').load();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const routes = require('./routes/routes.js');
const mongoose = require('mongoose');

require('./config/passport')(passport);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds121980.mlab.com:21980/place_api')
app.set('view engine', 'ejs');

app.use('/models', express.static(process.cwd() + '/models'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/views', express.static(process.cwd() + '/views'));

app.use(morgan('dev')); 
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(session({secret: 'secret',
				 saveUninitialized: true,
				 resave: true,
         store: new MongoStore({ mongooseConnection: mongoose.connection })
         }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
	res.locals.user = req.user || null;
	next();
})


routes(app, passport);

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});