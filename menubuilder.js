module.exports = menubuilder;

var _ = require('lodash');

function menubuilder (data, path, name, depth, checkvar) {
  var child, key, i, result = '', indent = '';
	if (_.isUndefined(path)) {
		path = '';
	}

	if (_.isUndefined(name)) {
		name = '';
	}

	if (_.isUndefined(checkvar)) {
		checkvar = 0;
	}

	if (_.isUndefined(depth)) {
		depth = 0;
	}

	for (key in data.children) {
		child = data.children[key];
		indent = '';
		for (i = 0; i <= depth; i++) {
			indent = indent + '\t';
		}
		
		if (_.has(child, 'children')) {

			if (checkvar == 0) {
			result = '<ul id=\"nav\">\n';
			checkvar = 1;
			}

				result = result + indent + '<li>' + '<a href =\"#\">Parent ' + key + '</a>\n' 
				result = result + indent + '\t<ul>\n' + menubuilder(child, child.path, key, depth + 1)
				result = result + indent + '\t</ul>\n' + indent + '\t\t<div class=\"clear\"></div>\n' + indent + '</li>\n';
		}
		
		else {
				result = result + indent + '\t<li><a href=\"' + path + child.path + '\">' + 'Item ' + name + key + '</a></li>\n';
		}
	}

	if (checkvar == 1) {
		result = result + '</ul>\n\n<div class=\"clear\"></div>';
	}	
	return result;
}
