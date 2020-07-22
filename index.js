let { JSDOM } = require('jsdom');
let qsx = require('qsx');

module.exports = function(content, query, url) {
	let doc = new JSDOM(content, { url }).window.document;
	return qsx(doc, query);
}