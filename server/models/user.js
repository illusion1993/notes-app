var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function (dbConnection) {
	// User Schema
	var userSchema = new mongoose.Schema({
		first_name: {
			type: String,
			required: true
		},
		last_name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	});
	
	// Pre save hook to encrypt password
	userSchema.pre('save', function(next) {
		var user = this;
		if (this.isModified('password') || this.isNew) {
			bcrypt.genSalt(10, function(err, salt) {
				if (err) {
					return next(err);
				}
				bcrypt.hash(user.password, salt, function(err, hash) {
					if (err) {
						return next(err);
					}
					else {
						user.password = hash;
						next();
					}
				});
			});
		}
		else {
			return next();
		}
	});
	
	// Compare password
	userSchema.methods.comparePassword = function(password, callback) {
		bcrypt.compare(password, this.password, function(err, isMatch) {
			if (err) {
				return callback(err);
			}
			else {
				callback(null, isMatch);
			}
		})
	};

	var userModel = dbConnection.model('User', userSchema);

	return userModel;
}