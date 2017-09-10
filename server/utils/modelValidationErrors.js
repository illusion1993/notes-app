module.exports = function (err) {
	var errors = {};
	if (!err || !err.errors)
		return errors;
	for (field in err.errors) {
		if (err.errors[field].$isValidatorError)
			errors[field] = err.errors[field].message;
	}
	return errors;
}