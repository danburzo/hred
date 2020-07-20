#!/usr/bin/env node
let hred = require('./index.js');
let { stdin, stdout } = process;
let content = '';

let query = process.argv[2];

stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		stdout.write(JSON.stringify(
			hred(content, query), null, 2
		));
	});