import { storiesOf } from '@storybook/html';
import pathParse from 'path-parse';
import App from '../src/app';


var Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('json', function(context) {
	return JSON.stringify(context);
});

Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

	if (arguments.length < 3)
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

	var operator = options.hash.operator || "==";

	var operators = {
			'%':       function(l,r) { return l % r; },
			'==':       function(l,r) { return l == r; },
			'===':      function(l,r) { return l === r; },
			'!=':       function(l,r) { return l != r; },
			'<':        function(l,r) { return l < r; },
			'>':        function(l,r) { return l > r; },
			'<=':       function(l,r) { return l <= r; },
			'>=':       function(l,r) { return l >= r; },
			'typeof':   function(l,r) { return typeof l == r; }
	}

	if (!operators[operator])
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

	var result = operators[operator](lvalue,rvalue);

	if( result ) {
			return options.fn(this);
	} else {
			return options.inverse(this);
	}
});

const templateData = require.context('../src/materials', true, /\.json$/);
const templateFiles = require.context('../src/materials', true, /\.hbs$/);

let done = false;

let inter = setInterval(() => {

	if (done) {
		new App();
		clearInterval(inter);
	}

}, 500);

let i = 0;

templateFiles.keys().forEach(pathName => {

	let dir = pathParse(pathName).dir.split('/').pop();
	const name = pathParse(pathName).name;

	if (!templateData) {
		storiesOf(dir, module)
			.add(name, () => templateFiles(pathName));

	} else {

		const extPos = pathName.lastIndexOf('.');
		const jsonFilename = pathName.substr(0, extPos < 0 ? path.length : extPos) + ".json";
		let data = [];

		if (templateData.keys().indexOf(jsonFilename) >=  0) {
			data = templateData(jsonFilename);
		}

		let obj = {};
				obj[name] = data;

		const template = templateFiles(pathName);

		const html = template(obj);

		if (dir === '.') dir = 'root';
		storiesOf(dir, module)
			.add(name, () => html);
	}

	if (i++ >= (templateFiles.length - 1)) {
		done = true;
	}


});


