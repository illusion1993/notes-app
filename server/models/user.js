var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function (dbConnection) {

	var dashboardModel = require('./dashboard')(dbConnection);
	var noteModel = require('./note')(dbConnection);
	var noteListModel = require('./noteList')(dbConnection);
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
			else {
				var notes_count, note_lists_count;
				noteModel.count({user: mongoose.Types.ObjectId(user._id)}, function(err, count) {
					if (err)
						callback(err);
					else {
						notes_count = count;
						noteModel.count({user: mongoose.Types.ObjectId(user._id)}, function(err, count) {
							if (err)
								callback(err);
							else {
								note_lists_count = count;
								if (!dash) {
									var dashboard = new dashboardModel({
										user: user
									});
									dashboard.save(function(err, dash) {
										dash = dash.toObject();
										dash['notes_count'] = notes_count;
										dash['note_lists_count'] = note_lists_count;
										console.log(dash);
										callback(err, dash);
									});
								}
								else {
									dash.user = user;
									dash = dash.toObject();
									dash['notes_count'] = notes_count;
									dash['note_lists_count'] = note_lists_count;
									console.log(dash);
									callback(err, dash);
								}
							}
						});
					}
				});
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
				subdocsManip.handleSubdocArray(dash, domain, 'domains', ['title'], is_delete, callback);
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
				subdocsManip.handleSubdocArray(dash, tag, 'tags', ['title'], is_delete, callback);
			}
		});
	};

	// Method to add/edit/delete a new NoteType
	userSchema.methods.addEditDeleteNoteType = function(payload, is_delete, callback) {
		var user = this;
		var note_type = {
			_id: payload._id,
			title: payload.title,
			icon: payload.icon,
		};

		fetchDashboardFromUserId(this._id, function(err, dash) {
			if (err) {
				callback(err);
			}
			else {
				subdocsManip.handleSubdocArray(dash, note_type, 'note_types', ['title'], is_delete, callback);
			}
		});
	};

	// Method to add/edit/delete a new widget
	userSchema.methods.addEditDeleteWidget = function(payload, is_delete, callback) {
		var user = this;
		var widget = {
			_id: payload._id,
			title: payload.title,
			widget_type: payload.widget_type,
			references: payload.references
		};

		fetchDashboardFromUserId(this._id, function(err, dash) {
			if (err) {
				callback(err);
			}
			else {
				subdocsManip.handleSubdocArray(dash, widget, 'widgets', ['title'], is_delete, callback);
			}
		});
	};

	var userModel = dbConnection.model('User', userSchema);

	return userModel;
}