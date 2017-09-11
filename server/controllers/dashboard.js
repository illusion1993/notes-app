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
		},

		addDomain: function(req, res) {
			req.user.addEditDeleteDomain(req.body, false, function(err, domain) {
				if (err || !domain) {
					res.status(500).json({success: false, message: "Error occured, Can not create domain"})
				}
				else {
					res.json({ success: true, data: domain });
				}
			});
		},

		deleteDomain: function(req, res) {
			req.user.addEditDeleteDomain(req.body, true, function(err) {
				if (err) {
					res.status(500).json({success: false, message: "Error occured, Can not delete domain"})
				}
				else {
					res.json({ success: true, message: "Deleted domain" });
				}
			});
		}
	}

	return controllers;
}