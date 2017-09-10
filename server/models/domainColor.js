var mongoose = require('mongoose');

module.exports = function (dbConnection) {
	var domainColorSchema = new mongoose.Schema({
		hex: {
			type: String,
			required: true
		}
	});
	return dbConnection.model('DomainColor', domainColorSchema);
}