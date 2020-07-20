let { JSDOM } = require('jsdom');
let qsx = require('qsx');

module.exports = function(content, query) {
	let doc = new JSDOM(content).window.document;
	return qsx(doc, query);
}