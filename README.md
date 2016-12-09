[![portable hole](https://i.imgur.com/RsUlrGE.jpg)](https://vimeo.com/21509708)

Portable Holes is a set of client-side adapters for various embed codes. 
It aims to keep your article bodies clean while still allowing you 
to have rich embeds within them.  It is the successor to [Embeditor](https://github.com/SCPR/embeditor-rails).

# Installation
`npm install -g portable-holes`

# Usage
There are a few ways to use Portable Holes.

## Standalone Script
You can use it as a script that you pass markup through **stdin**.

```sh
echo "<somemarkup>" | portable-holes
```

Working Example:

```sh
echo "<a href='http://projects.scpr.org/firetracker/oembed?url=http://projects.scpr.org/firetracker/rim-fire/' data-maxheight='450' class='embed-placeholder' data-service='firetracker'>Rim Fire</a>" | portable-holes
```

If you want to keep the process active while passing in multiple pieces of HTML, you should include `\x04`(EOT character) as a delimiter between your HTML documents.  Normally, a newline character is used to delimit standard input, but it's likely that our HTML will contain newlines and it's a bit hazardous to strip them out.  Better to use a character that's highly-unlikely to be in your HTML.

Portable Holes works in Node.js.  Because it was originally built for the browser in Rails apps, it expects a jQuery-like root object.  This may change in the future.  For Node.js use, I recommend using [Cheerio](https://github.com/cheeriojs/cheerio) which is a stripped-down version of jQuery for parsing documents, and [Najax](https://github.com/najaxjs/najax) to shim `jQuery.ajax()`.

Configuration can be stored both in `~/.portable-holes.yml` or `./.portable-holes.yml`(the current directory).  The individual settings from the configuration in the current directory takes precedence over those in the user's home folder.

## Node.js

```javascript
const PortableHoles = require('portable-holes');
const cheerio       = require('cheerio');

let $  = cheerio.load("<somemarkup></somemarkup>");
$.ajax = require('najax');

let holes = new PortableHoles({$: $});

holes.swap();
```

## Browser
It even works in the browser!  Just include `dist/portable-holes.js` in a script tag within your HTML page and in your JavaScript:

```javascript
var PortableHoles = require('portable-holes');

var holes = new PortableHoles({$: $});

holes.swap();
```

Note that you must have jQuery initialized on your page for this to work.

The PortableHoles class has an *complete* event that you can subscribe to.  This event gets fired when all the placeholders have been processed.  This is mostly useful in the standalone script, but it's possible that these events can come in handy in other ways.

```javascript
holes.on('complete', function(){
  console.log('COMPLETE');
})
```

There is also a *swap* event that gets fired whenever an individual placeholder has been swapped.

# So what's it really doing?

Portable Holes works by replacing `A` tags with a specific class with the
appropriate embed. The default class is `embed-placeholder`, but that can be
configured.

There are several adapters included with this engine:

* **Embedly** - Covers several services, such as SoundCloud, Spotify, Scribd, Google
  Maps, and others. See
  [the list of Embedly's providers](http://embed.ly/embed/features/providers).
  Embedly doesn't always work perfectly, so Portable Holes provides manual adapters
  for some of the providers that Embedly claims to support.
* **Cover It Live**
* **Polldaddy**
* **KPCC's Fire Tracker**
* **Instagram**
* **Facebook**
* **Twitter**
* **Storify**
* **Brightcove**
* **Document Cloud** - Not yet supported.
* **Rebel Mouse**


# Configuration

## PortableHoles

You can configure:

* `defaultAdapter` - The adapter that will be used if no adapter is found for
  the provided service.
* `defaultService` - The service that will be used if no service is provided
  on the placeholder link.
* `wrapperClass` - The class of the div that will get wrapped around the embed.
* `placeholderClass` - The class of the `<A>` tags that Portable Holes will look for.


## Embeds

PortableHoles offers a system of configuration precedence.
The order of precedence is:

1. `data-attributes` on the placeholder link itself.
2. Adapter-specific configuration in the `PortableHoles` base object.
3. Global configuration on `PortableHoles`
4. Adapter-specific defaults.

## data-attributes

You may add a `data-attribute` to any placeholder link, which will be used
in the query or embed code. This method of specifying configuration takes
precedence over any other configuration. The names of the data-attributes
get passed directly to the query or embed code (depending on the adapter).
Only the data-attributes which have to do with the embed will be passed through;
attributes like `data-service` won't be used.

In the following example, the `maxheight` property will be sent to the oembed
endpoint:

```html
<a href="http://projects.scpr.org/firetracker/oembed?url=http://projects.scpr.org/firetracker/rim-fire/" data-maxheight="450" class="embed-placeholder" data-service="firetracker">Rim Fire</a>
```

## Adapter-specific configuration

When initializing the global `PortableHoles` class, you may specify
configuration for individual adapters.

The `display` object is for configuring display options. Properties:
* `placement` - the method to use for placing the embed, such as
  `before`, `after`, or `replace`. Default is `after`.

The `query` object is for configuring the query parameters, or in the case of
an adapter which doesn't use a query, it's for configuring the embed properties.

For the most part, everything will be pretty consistent.

```javascript
new PortableHoles({
    Embedly: {
        query: {
            maxheight: 450
        }
    },
    FireTracker: {
        query: {
            maxheight: 350
        },
        display: {
          placement: 'replaceWith'
        }
    },
    CoverItLive: {
        query: {
            maxheight: 500
        }
    }
})
```

## Global configuration

You may also specify global configuration in `PortableHoles`, which will be
used for all adapters:

```javascript
new PortableHoles({
    maxheight: 450,
    maxwidth: 200
})
```

There are also some PortableHoles options you can configure:

* `defaultAdapter` - Adapter that gets used when the service isn't recognized.
  default: `Embedly`
* `defaultServer` - Service that gets used when the `data-service` attribute is
  missing. default: `other`
* `placeholderClass` - The class that the embed placeholders are given.
  default: `embed-placeholder`
* `wrapperClass` - The class the embed's wrapper is given.
  default: `embed-wrapper`
* `wrapperElement` - The element which should be wrapped around all embeds.
  default: `div`
* `defaultPlacement` - Default embed placement, if a placement is somehow
  missing or it doesn't exist in the PlacementFunctions object. default: `after`

# Embedly

Embedly requires an API key.
You can provide it in the `query` options for the Embedly adapter when
initializing `PortableHoles`:

```javascript
new PortableHoles({
    Embedly: {
        query: {
            key: 'YOUR_API_KEY'
        }
    }
})
```


# oEmbed vs. non-oEmbed

This library isn't necessarily tied to oEmbed, however it does have support for
it. Even for services which support oEmbed, there are static templates which
are able to render the embed properly just based off of the provided URL.
This eliminates any oEmbed headaches (Access-Control-Allowed-Origin, for
example), and also reduces the time it takes for an embed to load.


# CKEditor plugin

An unofficial CKEditor plugin can be found [HERE](https://github.com/SCPR/SCPRv4/blob/master/vendor/assets/javascripts/ckeditor/plugins/embed-placeholder/plugin.js).
Copy and paste it into your own repository.

# Known Issues

* Cover It Live and Facebook embeds don't currently work together on the same
  page, due to a javascript conflict between the two.

# Contributing

If you have an adapter that you think would be useful for many, please open
up a pull request.
