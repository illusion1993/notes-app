var modelErrors = require('../utils/modelValidationErrors');
var jwt = require('jsonwebtoken');

module.exports = function (userModel, secretKey, tokenExpiry) {
	var controllers = {
		register: function(req, res) {
			var newUser = new userModel({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				password: req.body.password
			});
			newUser.save(function(err) {
				var errors = modelErrors(err);
				if (err && Object.keys(errors).length) {
					res.status(400).json({ success: false, message: 'Registration failed', errors: errors });
				}
				else if (err) {
					res.status(400).json({ success: false, message: 'Registration failed', errors: { email: 'Email already exists' } });
				}
				else {
					res.json({ success: true, message: 'Registration complete' });
				}
			});
		},
		login: function(req, res) {
			if (!req.body.email || !req.body.password) {
				res.status(400).json({ success: false, message: "Please enter email and password to login" });
			}
			else {
				userModel.findOne({ email: req.body.email }, function(err, user) {
					if (err) {
						res.status(400).json({ success: false, message: "Authentication failed" });
					}
					if (!user) {
						res.status(400).json({ success: false, message: "Email does not exist" });
					}
					else {
						user.comparePassword(req.body.password, function(err, isMatch) {
							if (isMatch && !err) {
								user = JSON.parse(JSON.stringify(user));

								var token = jwt.sign(user, secretKey, { expiresIn: tokenExpiry });
								res.json({ success: true, token: 'JWT ' + token });
							}
							else {
								res.status(400).json({ success: false, message: "Invalid password" });
							}
						});
					}
				})
			}
		}
	};

	return controllers;
}