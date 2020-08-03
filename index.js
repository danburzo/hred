let { JSDOM } = require('jsdom');
let qsx = require('qsx');

module.exports = function(content, query, url, contentType) {
	let doc = new JSDOM(content, { url, contentType }).window.document;
	return qsx(doc, query);
}