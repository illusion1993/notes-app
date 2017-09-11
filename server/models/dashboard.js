var mongoose = require('mongoose');

module.exports = function (dbConnection) {

	// Schema for a reference inside a widget, this is simply a foreign key for
	// any notes/lists that a widget refers to or contains
	var widgetDataReferenceSchema = new mongoose.Schema({
		reference: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		}
	});

	// Schema for widget, this goes nested inside dashboard
	var widgetSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true
		},
		widget_type: {
			type: String,
			required: true,
			enum: ['QUICK_VIEW', 'NOTE', 'LIST', 'LIST_GROUP']
		},
		references: [widgetDataReferenceSchema],
		position: {
			type: Number
		}
	});

	// Schema for all user-defined domains
	var domainSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		color: {
			type: mongoose.Schema.Types.ObjectId,
			required: false
		}
	});

	// Schema for all user-defined tags
	var tagSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true
		}
	});

	// Schema for all user-defined note-types
	var noteTypeSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true
		},
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			required: false
		}
	});

	// Complete dashboard schema
	var dashboardSchema = new mongoose.Schema({
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
			unique: true
		},
		widgets: [widgetSchema],
		domains: [domainSchema],
		tags: [tagSchema],
		note_types: [noteTypeSchema]
	});

	var dashboardModel = dbConnection.model('Dashboard', dashboardSchema);

	return dashboardModel;
}