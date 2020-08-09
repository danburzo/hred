#!/usr/bin/env node
let opsh = require('opsh');
let hred = require('./index.js');
let pkg = require('./package.json');

let { stdin, stdout } = process;

// Set of options accepting an argument
let accepts_optarg = new Set(['u', 'url']);

// Accumulate options and their arguments on the one hand,
// and operands, on the other
let opts = {}; 
let operands = [];
opsh(process.argv.slice(2), {
	option(option, value) {
		opts[option] = value !== undefined ? option : true;
	},
	operand(operand, opt) {
		if (opt !== undefined && accepts_optarg.has(opt)) {
			opts[opt] = operand;
		} else {
			operands.push(operand);
		}
	}
});

if (opts.version || opts.V) {
	console.log(pkg.version);
	process.exit(0);
}

if (opts.help || opts.h) {
	console.log(
`hred version ${pkg.version}

Reduce HTML (and XML) to JSON from the command line.
Details at: https://github.com/danburzo/hred

Usage: hred [options...]

General options:

-h, --help             Print this help message
-V, --version          Print hred version

Input options:

-u <url>, --url=<url>  Specify base URL for relative HTML attributes
-x, --xml              Parse input as XML rather than HTML

Output options:

-c, --concat           Output array as concatenated JSON records
-r, --raw              Output raw (unquoted) strings

Examples:

Get the "alt" and "src" HTML attributes of images on a Wikipedia page:
	
	curl https://en.wikipedia.org/wiki/Banana | hred "img { @alt, @src }"

Read the titles and definitions of HTTP response codes from a MDN page:

	curl https://developer.mozilla.org/en-US/docs/Web/HTTP/Status | hred "
		dt { 
			a { 
				@href, 
				^ :scope > code @.textContent >> title
			} >> .,
			:scope + dd @.textContent
		}
	"
`);
	process.exit(0);
}

let content = '';
stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		let res = hred(content, operands[0] || '^', opts.url || opts.u, (opts.x || opts.xml) ? 'application/xml' : 'text/html'), out;
		if ((opts.concat || opts.c) && Array.isArray(res)) {
			out = res.map(it => {
				if ((opts.raw || opts.r) && typeof it === 'string') {
					return it;
				}
				return JSON.stringify(it, null, 2);
			}).join('\n');
		} else {
			out = (opts.raw || opts.r) && typeof res === 'string' ? res : JSON.stringify(res, null, 2);
		}
		stdout.write(out);
	});