module.exports = radMenuBuilder;

var _ = require('lodash');

function radMenuBuilder (data, path, name, depth, checkvar) {
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
			result = '<div id=\"radial-menu\" class=\"positioned\" style=\"position:absolute; top: 25px, left:20%\">\n'
			result = result + indent + '<input type=\"button\" id=\"toggle-radial\" value=\"\">\n' //need to check if I can have menu open by default//
			result = result + indent + '<ul class=\"level-1\">\n';
			checkvar = 1;
			}

				result = result + indent + '\t<li>' + '<a href =\"#\">Parent ' + key + '</a>\n' 
				result = result + indent + '\t\t<ul class= \"level-2\">\n' + radMenuBuilder(child, child.path, key, depth + 1)
				result = result + indent + '\t\t</ul>\n' + indent + '\t</li>\n';
		}
		
		else {
				result = result + indent + '\t\t<li><a href=\"' + path + child.path + '\">' + 'Item ' + name + key + '</a></li>\n';
		}
	}

	if (checkvar == 1) {
		result = result + indent + '</ul>\n'
		result = result + '</div>';
	}	
	return result;
}
