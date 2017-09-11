var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function (dbConnection) {

	var dashboardModel = require('./dashboard')(dbConnection);

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

	// Method to add a new Domain
	userSchema.methods.addEditDeleteDomain = function(payload, isDelete, callback) {
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
				var id_index = -1, same_title_id = undefined;
				dash.domains.forEach(function(obj, index) {
					if (obj._id == domain._id)
						id_index = index;
					if (obj.title == domain.title)
						same_title_id = obj._id;
				});
				
				if (isDelete) {
					if (id_index >= 0) {
						dash.domains[id_index].remove();
						dash.save(function(err, dash) {
							callback(err);
						});
					}
					else {
						callback(new Error('Domain not found'));
					}
				}
				else {
					if (!domain._id) {
						if (!same_title_id) {
							dash.domains.push(domain);
							dash.save(function(err, dash) {
								callback(err, dash.domains[dash.domains.length - 1]);
							});
						}
						else {
							callback(new Error('Title already exists'));
						}
					}
					else {
						if (id_index >= 0) {
							if (same_title_id == domain._id || !same_title_id) {
								dash.domains[id_index] = domain;
								dash.save(function(err, dash) {
									callback(err, dash.domains[id_index]);
								});
							}
							else {
								callback(new Error('Title already exists'));
							}
						}
						else {
							domain._id = undefined;
							dash.domains.push(domain);
							dash.save(function(err, dash) {
								callback(err, dash.domains[dash.domains.length - 1]);
							});
						}
					}
				}
			}
		});
	}

	var userModel = dbConnection.model('User', userSchema);

	return userModel;
}