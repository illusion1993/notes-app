var mongoose = require('mongoose');

module.exports = function (dbConnection) {
	var dashboardSchema = new mongoose.Schema({
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
			unique: true
		}
	});

	var dashboardModel = dbConnection.model('Dashboard', dashboardSchema);

	return dashboardModel;
}