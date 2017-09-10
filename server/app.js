var express			= require('express');
var bodyParser		= require('body-parser');
var jwt				= require('jsonwebtoken');
var morgan			= require('morgan');
var passport		= require('passport');
var mongoose		= require('mongoose');
var bcrypt			= require('bcrypt');
var jwtStrategy		= require('passport-jwt').Strategy;
var extractJwt		= require('passport-jwt').ExtractJwt;
var cors			= require('cors');
var app				= express();
var apiRoutes		= express.Router();

var dbConnection	= require('./utils/dbConnection')('notes', process.env.MONGO_USER, process.env.MONGO_PASSWORD, process.env.MONGO_PORT);

const PORT = 8000;








console.log('App running on port ' + PORT);
app.listen(PORT);