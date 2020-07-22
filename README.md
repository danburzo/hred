# hred

hred (**h**tml **red**uce) is a command-line tool to extract data from HTML. It reads HTML from stdin and outputs to stdout the JSON produced by a [qsx query](https://github.com/danburzo/qsx):

```bash
> curl http://danburzo.ro | hred "li a { @href, @.textContent }"
[
  {
    "href": ".",
    ".textContent": "Dan Burzo"
  },
  ...
]
``` 

[The qsx documentation](https://github.com/danburzo/qsx) describes the kinds of queries you can make with hred, but if you're familiar with CSS selectors you're mostly good to go.

## Installation

hred runs on Node.js. You can find hred in the npm registry:

```bash
# install globally with npm:
npm install -g hred

# install globally with yarn:
yarn global add hred

# run it without installing:
npx hred 
```

## Usage

hred accepts a qsx query string:

```bash
curl https://en.wikipedia.org/wiki/Banana | hred "img { @alt, @src }"

[
  {
    "alt": "Page semi-protected",
    "src": "//upload.wikimedia.org/wikipedia/en/thumb/1/1b/Semi-protection-shackle.svg/20px-Semi-protection-shackle.svg.png"
  },
  {
    "alt": "Banana and cross section.jpg",
    "src": "//upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Banana_and_cross_section.jpg/250px-Banana_and_cross_section.jpg"
  },
  ...
]
```

hred has the single, modest purpose of extracting parts of HTML as JSON. Because the qsx query language is a lightweight extension to the CSS selector syntax used by the `Element.querySelectorAll()` DOM method, hred offers only limited reshaping of the resulting JSON via aliases. The tool is designed to be piped to something like [`jq`](https://stedolan.github.io/jq/) if further JSON processing is necessary.

hred has a few options available:

Option | Description
------ | -----------
`-c`, `--concat` | if the result is an array, return it as [concatenated JSON records](https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON), to make it easier to collate several results together
`-h`, `--help` | print help message
`-r`, `--raw` | a complement to `-c` that returns raw (unquoted) strings when the result is an array of strings
`-u <url>`, `--url=<url>` | add the base URL against which the HTML should be evaluated; influences the value of the DOM properties `@.href`, `@.src` when the HTML attributes are relative
`-V`, `--version` | display the current version

## A real-life example

Let's take a web page that uses atomic, presentational CSS rather than semantic CSS classes (and thus makes it more challenging to extract data), such as [my starred repos page](https://github.com/danburzo?tab=stars). To extract info about the repositories, at the time of writing:

```bash
curl https://github.com/danburzo\?tab\=stars | hred "
.mb-1 {
	h3 a { 
		@href >> url , 
		@.textContent >> title 
	} >> ., 
	^ :scope ~ .py-1 @.textContent >> description 
}"
```

Let's break the query apart:

> For each element with the class `mb-1`:
> 1. on the one hand, find `<a>` elements nested into `<h3>`s: 
>    1. read their `href` HTML attribute as `url` and their `textContent` DOM property as `title`;
>    2. merge the resulting object into the current scope with `>> .`;
> 1. on the other hand, find the first (`^`) subsequent element (`:scope ~`) that matches the class `py-1`
>    1. extract its `textContent` as `description`. 

The resulting JSON, abridged:

```json
[
  {
    "url": "/urfave/cli",
    "title": "\n        urfave / cli\n      ",
    "description": "\n      \n        A simple, fast, and fun package for building command line apps in Go\n      \n  "
  },
```

## A note on security

hred uses [jsdom](https://github.com/jsdom/jsdom) as the DOM provider. Although it is used for the sole purpose of parsing the HTML and querying the resulting DOM, and [script execution is disabled by default](https://github.com/jsdom/jsdom#executing-scripts), it's always a good idea to be mindful when feeding untrusted HTML from the world wide web into hred.

## Related projects

You might be interested in these:

* [pup](https://github.com/ericchiang/pup/) was the original _`jq` for HTML_;
* [x-ray](https://github.com/matthewmueller/x-ray) has the concept of including HTML attributes in the query string; 
* [gdom](https://github.com/syrusakbary/gdom) — `qsx` looks a bit like GraphQL, so maybe GraphQL for DOM can be a thing
* [tq](https://github.com/plainas/tq) — another popular CLI tool for extracting data from HTML