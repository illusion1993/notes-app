module.exports = function (userModel) {
	var controllers = {
		
		dashboard: function(req, res) {
			req.user.getDashboard(function(err, dashboard) {
				if (err) {
					res.status(500).json({success: false, message: "Error occured, Can not get dashboard"})
				}
				else {
					res.json({ success: true, data: dashboard });
				}
			});
		}
	}

	return controllers;
}