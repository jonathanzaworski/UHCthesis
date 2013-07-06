module.exports = capitalize;

var _ = require('lodash');

function capitalize(letter) {
			var capitalstring;
			if (_.isString(letter)) {
					capitalstring=letter.toUpperCase();
			}
			
			else { console.log('Error, input not a string') };				

	return capitalstring;
}
