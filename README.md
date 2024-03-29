![hred](./.github/hred.svg)

<a href="https://www.npmjs.org/package/hred"><img src="https://img.shields.io/npm/v/hred.svg?style=flat-square&labelColor=CC9252&color=black" alt="npm version"></a>

hred (**h**tml **red**uce) is a command-line tool to extract data from HTML. It reads HTML from the standard input and outputs the JSON produced by a [qsx query](https://github.com/danburzo/qsx):

```bash
> curl https://danburzo.ro/rolodex/ | hred "article a { @href, @.textContent }"
[
  {
    "href": "http://www.3quarksdaily.com/",
    ".textContent": "3 Quarks Daily"
  },
  {
    "href": "http://50watts.com",
    ".textContent": "50 Watts"
  },
  {
    "href": "http://aworkinglibrary.com/",
    ".textContent": "A Working Library"
  },
  ...
]
``` 

[The qsx documentation](https://github.com/danburzo/qsx) describes the kinds of queries you can make with hred, but if you're familiar with CSS selectors you're mostly good to go.

## Installation

hred runs on Node.js. You can find hred in the npm registry:

```bash
# install hred globally with npm:
npm install -g hred

# install hred globally with yarn:
yarn global add hred

# run hred without installing it:
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
`-f <queryfile>`, `--file=<queryfile>` | read the query from an external file instead of passing it as an operand
`-h`, `--help` | print help message
`-r`, `--raw` | a complement to `-c` that returns raw (unquoted) strings when the result is an array of strings
`-u <url>`, `--url=<url>` | add the base URL against which the HTML should be evaluated; influences the value of the DOM properties `@.href`, `@.src` when the HTML attributes are relative
`-V`, `--version` | display the current version
`-x`, `--xml` | parse the input as XML rather than HTML

## A real-life example

Let's take a web page that uses atomic, presentational CSS rather than semantic CSS classes (and thus makes it more challenging to extract data), such as [my starred repos page](https://github.com/danburzo?tab=stars). To extract info about the repositories, at the time of writing:

```bash
curl https://github.com/danburzo\?tab\=stars | hred "
.mb-1 {
	h3 a ...{ 
		@href => url , 
		@.textContent => title 
	}, 
	^ :scope ~ .py-1 @.textContent => description 
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

hred uses as its DOM environment [jsdom](https://github.com/jsdom/jsdom), which has the ability to run the JavaScript included in web pages. Because scripts specially crafted to attack jsdom may potentially evade the sandbox to which their execution is confined and access your machine through Node.js APIs, [script execution is disabled](https://github.com/jsdom/jsdom#executing-scripts); furthermore, external resources (scripts, images, stylesheets, iframes) are not fetched. Even with these precautions, be careful with what web pages you process with hred; when in doubt, inspect the page's source code beforehand.

## Related projects

You might be interested in these:

* [pup](https://github.com/ericchiang/pup/) was the original _`jq` for HTML_;
* [x-ray](https://github.com/matthewmueller/x-ray) has the concept of including HTML attributes in the query string; 
* [gdom](https://github.com/syrusakbary/gdom) — `qsx` looks a bit like GraphQL, so maybe GraphQL for DOM can be a thing;
* [tq](https://github.com/plainas/tq) — another popular CLI tool for extracting data from HTML;
* [htmlq](https://github.com/mgdm/htmlq) — like `jq`, but for HTML;
* [xidel](https://github.com/benibela/xidel) supports a variety of query languages (CSS, XQuery, XPath, etc.);
* [wikipedia_ql](https://github.com/zverok/wikipedia_ql) — a query language for efficient data extraction from Wikipedia;
* [dbohdan/structured-text-tools](https://github.com/dbohdan/structured-text-tools/) maintains a comprehensive list of command-line tools for manipulating structured text data.