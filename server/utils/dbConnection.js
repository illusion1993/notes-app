var mongoose = require('mongoose');

module.exports = function (db_name, db_username, db_password, db_port) {
	// Connection util
	var connection_string = 'mongodb://' + db_username + ':' + db_password + '@127.0.0.1:' + db_port + '/' + db_name + '?authSource=' + 'admin';
	return mongoose.createConnection(connection_string);
}