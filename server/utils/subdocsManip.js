module.exports.handleSubdocArray = function (doc, subdoc_payload, array_field_name, locally_unique_subdoc_fields, is_delete, callback) {

	var index_of_this_subdoc = -1, unique_property_broken = false;
	
	doc[array_field_name].forEach(function(obj, index) {
		if (obj._id == subdoc_payload._id)
			index_of_this_subdoc = index;
		
		locally_unique_subdoc_fields.forEach(function(field) {
			if (obj[field] == subdoc_payload[field] && obj._id != subdoc_payload._id) {
				unique_property_broken = true;
			}
		});
	});

	if (is_delete) {
		if (index_of_this_subdoc < 0) {
			callback(new Error());
		}
		else {
			doc[array_field_name][index_of_this_subdoc].remove();
			doc.save(function(err) {
				callback(err);
			});
		}
	}

	else {
		if (unique_property_broken) {
			callback(new Error());
		}
		else {
			if (index_of_this_subdoc < 0) {
				subdoc_payload._id = undefined;
				doc[array_field_name].push(subdoc_payload);
				doc.save(function(err, doc) {
					if (err)
						callback(err);
					else
						callback(err, doc[array_field_name][doc[array_field_name].length- 1]);
				});
			}
			else {
				doc[array_field_name][index_of_this_subdoc] = subdoc_payload;
				doc.save(function(err, doc) {
					if (err)
						callback(err);
					else
						callback(err, doc[array_field_name][index_of_this_subdoc]);
				});
			}
		}
	}

}