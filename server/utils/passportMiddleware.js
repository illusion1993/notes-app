var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (passport, secret_key, user_model) {
	var options = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
		secretOrKey: secret_key
	};

	passport.use(new JwtStrategy(options, function(jwt_payload, callback){
		user_model.findOne({id: jwt_payload.id}, function(err, user) {
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