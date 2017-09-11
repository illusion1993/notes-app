var express = require('express');
var bodyParser = require('body-parser');
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

var authControllers = require('./controllers/auth')(userModel, process.env.SECRET_KEY, 4000);
var dashboardControllers = require('./controllers/dashboard')(userModel);

// Authentication routes
apiRoutes.post('/register', authControllers.register);
apiRoutes.post('/login', authControllers.login);

// Dashboard routes
apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), dashboardControllers.dashboard);
apiRoutes.post('/dashboard/domain', passport.authenticate('jwt', { session: false }), dashboardControllers.addDomain);
apiRoutes.delete('/dashboard/domain', passport.authenticate('jwt', { session: false }), dashboardControllers.deleteDomain);
apiRoutes.post('/dashboard/tag', passport.authenticate('jwt', { session: false }), dashboardControllers.addTag);
apiRoutes.delete('/dashboard/tag', passport.authenticate('jwt', { session: false }), dashboardControllers.deleteTag);
apiRoutes.post('/dashboard/note-type', passport.authenticate('jwt', { session: false }), dashboardControllers.addNoteType);
apiRoutes.delete('/dashboard/note-type', passport.authenticate('jwt', { session: false }), dashboardControllers.deleteNoteType);
apiRoutes.post('/dashboard/widget', passport.authenticate('jwt', { session: false }), dashboardControllers.addWidget);
apiRoutes.delete('/dashboard/widget', passport.authenticate('jwt', { session: false }), dashboardControllers.deleteWidget);




console.log('App running on port ' + PORT);
app.listen(PORT);