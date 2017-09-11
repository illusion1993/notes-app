var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function (dbConnection) {

	var dashboardModel = require('./dashboard')(dbConnection);
	var subdocsManip = require('../utils/subdocsManip');

	function fetchDashboardFromUserId (user_id, callback) {
		dashboardModel.findOne({user: mongoose.Types.ObjectId(user_id)}, function(err, dash) {
			callback(err, dash);
		});
	};

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

	// Method to retrieve dashboard
	userSchema.methods.getDashboard = function(callback) {
		var user = this;
		fetchDashboardFromUserId(this._id, function(err, dash) {
			if (err) {
				callback(err);
			}
			if (!dash) {
				var dashboard = new dashboardModel({
					user: user
				});
				dashboard.save(function(err, dash) {
					callback(err, dash);
				});
			}
			else {
				dash.user = user;
				callback(err, dash);
			}
		});
	};

	// Method to add/edit/delete a new Domain
	userSchema.methods.addEditDeleteDomain = function(payload, is_delete, callback) {
		var user = this;
		var domain = {
			_id: payload._id,
			title: payload.title,
			description: payload.description,
			color: payload.color
		};

		fetchDashboardFromUserId(this._id, function(err, dash) {
			if (err) {
				callback(err);
			}
			else {
				subdocsManip.handleSubdocArray(
						dash,
						domain,
						'domains',
						['title'],
						is_delete,
						callback
					);
			}
		});
	};

	// Method to add/edit/delete a new Tag
	userSchema.methods.addEditDeleteTag = function(payload, is_delete, callback) {
		var user = this;
		var tag = {
			_id: payload._id,
			title: payload.title,
		};

		fetchDashboardFromUserId(this._id, function(err, dash) {
			if (err) {
				callback(err);
			}
			else {
				subdocsManip.handleSubdocArray(
						dash,
						tag,
						'tags',
						['title'],
						is_delete,
						callback
					);
			}
		});
	};

	var userModel = dbConnection.model('User', userSchema);

	return userModel;
}