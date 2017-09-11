var mongoose = require('mongoose');

module.exports = function (dbConnection) {

	var noteListSchema = new mongoose.Schema({
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
		tags: {
			type: [mongoose.Schema.Types.ObjectId]
		},
		domain: {
			type: mongoose.Schema.Types.ObjectId
		},
		priority: {
			type: Number,
			enum: [1, 2, 3, 4],
			default: 4
		}
	});

	var noteListModel = dbConnection.model('NoteList', noteListSchema);

	return noteListModel;
}