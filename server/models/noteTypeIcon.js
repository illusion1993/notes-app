var mongoose = require('mongoose');

module.exports = function (dbConnection) {
	var noteTypeIconSchema = new mongoose.Schema({
		title: {
			type: String,
			required: true,
			unique: true
		},
		class: {
			type: String,
			required: true,
			unique: true
		}
	});
	return dbConnection.model('noteTypeIcon', noteTypeIconSchema);
}