#!/usr/bin/env node
let hred = require('./index.js');
let { stdin, stdout } = process;
let content = '';

let args = process.argv.slice(2);

let opts = {}, query;

args.forEach(arg => {
	if (arg.match(/^-[^-]/)) {
		let flags = arg.replace(/-/g, '').split('');
		flags.forEach(f => opts[f] = true);
	} else if (query == undefined) {
		query = arg;
	}
});

stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		let res = hred(content, query), out;
		if (opts.c && Array.isArray(res)) {
			out = res.map(it => {
				if (opts.r && typeof it === 'string') {
					return it;
				}
				return JSON.stringify(it, null, 2);
			}).join('\n');
		} else {
			out = JSON.stringify(res, null, 2);
		}
		stdout.write(out);
	});