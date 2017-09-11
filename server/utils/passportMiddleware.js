var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');

module.exports = function (passport, secret_key, user_model) {
	var options = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
		secretOrKey: secret_key
	};

	passport.use(new JwtStrategy(options, function(jwt_payload, callback){
		user_model.findOne({_id: mongoose.Types.ObjectId(jwt_payload._id)}, function(err, user) {
			if (err) {
				return callback(err, false);
			}
			if (user) {
				callback(null, user);
			}
			else {
				callback(null, false);
			}
		});
	}));
}