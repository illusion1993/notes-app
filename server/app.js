var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');

var dbConnection = require('./utils/dbConnection')('notes', process.env.MONGO_USER, process.env.MONGO_PASSWORD, process.env.MONGO_PORT);
var userModel = require('./models/user')(dbConnection);
var passportMiddleware = require('./utils/passportMiddleware')(passport, process.env.SECRET_KEY, userModel);

var app = express();
var apiRoutes = express.Router();

var PORT  = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/api', apiRoutes);






console.log('App running on port ' + PORT);
app.listen(PORT);