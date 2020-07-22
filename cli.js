#!/usr/bin/env node
let minimist = require('minimist');
let hred = require('./index.js');
let pkg = require('./package.json');

let { stdin, stdout } = process;
let opts = minimist(process.argv.slice(2));

let content = '';

if (opts.version || opts.V) {
	console.log(pkg.version);
	process.exit(0);
}

if (opts.help || opts.h) {
	console.log(
`hred version ${pkg.version}

Reduce HTML to JSON from the command line.
Details at: https://github.com/danburzo/hred

Usage: hred [options...]

Options:

-h, --help             Print this help message
-V, --version          Print hred version

-c, --concat           Output array as concatenated JSON records
-r, --raw              Output raw (unquoted) strings
-u <url>, --url=<url>  Specify base URL for relative HTML attributes
`);
	process.exit(0);
}

stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		let res = hred(content, opts._[0] || '^', opts.url || opts.u), out;
		if ((opts.concat || opts.c) && Array.isArray(res)) {
			out = res.map(it => {
				if ((opts.raw || opts.r) && typeof it === 'string') {
					return it;
				}
				return JSON.stringify(it, null, 2);
			}).join('\n');
		} else {
			out = JSON.stringify(res, null, 2);
		}
		stdout.write(out);
	});