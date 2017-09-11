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
		},

		addTag: function(req, res) {
			req.user.addEditDeleteTag(req.body, false, function(err, tag) {
				if (err || !tag) {
					res.status(500).json({success: false, message: "Error occured, Can not create tag"})
				}
				else {
					res.json({ success: true, data: tag });
				}
			});
		},

		deleteTag: function(req, res) {
			req.user.addEditDeleteTag(req.body, true, function(err) {
				if (err) {
					res.status(500).json({success: false, message: "Error occured, Can not delete tag"})
				}
				else {
					res.json({ success: true, message: "Deleted tag" });
				}
			});
		}
	}

	return controllers;
}