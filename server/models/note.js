var mongoose = require('mongoose');

module.exports = function (dbConnection) {

	var noteSchema = new mongoose.Schema({
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		title: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		note_type: {
			type: mongoose.Schema.Types.ObjectId
		},
		urls: {
			type: [String]
		},
		list: {
			type: mongoose.Schema.Types.ObjectId
		},
		tags: {
			type: [mongoose.Schema.Types.ObjectId]
		},
		domain: {
			type: mongoose.Schema.Types.ObjectId
		},
		reminder: {
			type: Date
		}
	});

	var noteModel = dbConnection.model('Note', noteSchema);

	return noteModel;
}