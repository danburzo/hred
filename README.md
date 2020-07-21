# hred

`hred` (Html REDuce) is a command-line tool that takes HTML from `stdin` and outputs JSON on `stdout`, based on a [`qsx` query](https://github.com/danburzo/qsx).

You can install it from the npm registry:

```bash
# with npm
npm install -g hred

# with yarn
yarn global add hred
```

...or run it directly with `npx`:

```bash
npx hred 
```

## Usage

`hred` accepts a `qsx` query string:

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

[Read the `qsx` documentation](https://github.com/danburzo/qsx)

## Options

* `-c` — Return the JSON array as [concatenated records](https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON), to make it easier to collate several results together;
* `-r` — Return raw (unquoted) strings.

`hred` has a single purpose: to extract parts of a HTML file as JSON. Because the query language extends the `Element.querySelectorAll()` DOM method, `hred` can offer only limited reshaping of the resulting JSON without becoming a complicated DSL (domain-specific language). It is designed to be piped further along to something like [`jq`](https://stedolan.github.io/jq/) for further processing.

## Related projects

You might be interested in these:

* [pup](https://github.com/ericchiang/pup/) was the original _`jq` for HTML_;
* [x-ray](https://github.com/matthewmueller/x-ray) has the concept of including HTML attributes in the query string; 
* [gdom](https://github.com/syrusakbary/gdom) — `qsx` looks a bit like GraphQL, so maybe GraphQL for DOM can be a thing