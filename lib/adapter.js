'use strict';

// Your Adapter SHOULD define:
// * @QueryDefaults - The default parameters if no others are passed in.

let Defaults = require('./defaults');

class Adapter {
    static initClass() {
        this.prototype.className = "Adapter";
    
        this.QueryDefaults = {};
    
        this.DisplayDefaults =
            {placement : 'after'};
    }


    constructor($, element, options) {
        options = options || {};
        this.$       = $;
        this.element = element;
        this.options = options;
        // this.adapter    = PortableHole.Adapters[this.className];
        this.adapter    = this.constructor;
        this.templates  = this.options.templates
        this.href       = this.element.attr('href');
        this.service    = this.element.data('service');

        this.wrapper    = this.$(`<${this.options.wrapperElement} />`, {
            class: this.options.wrapperClass + ' ' + this.service
        });

        let displayData     = this._extractData('DisplayDefaults');
        this.display        = this._buildDisplayOptions(displayData);

        let queryData       = this._extractData('QueryDefaults');
        this.dataOptions    = queryData; // Deprecated
        this.queryParams    = this._buildQueryParams(queryData);
    }


    // @Override
    //
    // Use this method to swap a placeholder with an embed. It should be
    // specified on a per-adapter basis.
    //
    // This method could have some logic to figure out the parameters,
    // parse the URL, whatever, and then will probably call `this.embed()`
    // to actually modify the DOM.
    swap() {
        
    }


    // Put the embed inside the wrapper element, and then move the wrapper
    // element into place (relative to the placeholder link).
    //
    // This is a good function to call at the end of the swap() function.
    embed(html) {
        this.wrapper.html(html);

        let placementFunc = Defaults.PlacementFunctions[this.display.placement] ||
                        Defaults.PlacementFunctions[this.options.defaultPlacement];

        return this.element[placementFunc](this.wrapper);
    }



    _extractData(defaults) {
        let data = {};

        let object = this.element.data();
        for (let key in object) {
            // Make sure we care about this attribute
            let val = object[key];
            if (__guard__(this.adapter[defaults], x => x[key])) {
                data[key] = val;
            }
        }

        return data;
    }


    _buildDisplayOptions(data) {
        return this._defaultsWithoutEmptyStrings(data, // What the user wants
            __guard__(this.options[this.className], x => x['display']), // What the developer wants
            this.options['display'], // What the developer wants globally
            this.adapter.DisplayDefaults // What Embeditor wants
        );
    }


    // We're combining a few things (in order of precedence):
    // 1. The `data-attributes` of the placeholder,
    // 2. The adapter-specific options specified at Embeditor
    //    initialization,
    // 3. The global options specified at Embeditor initialization,
    // 4. This adapter's default options (fallback options).
    _buildQueryParams(data) {
        return this._defaultsWithoutEmptyStrings(data,
            __guard__(this.options[this.className], x => x['query']),
            this.options['query'],
            this.adapter.QueryDefaults
        );
    }

    // Like Underscore.defaults, but it will also fill in empty strings.
    // This should be used when merging objects that includes any user
    // input.
    _defaultsWithoutEmptyStrings(obj) {
        let args = Array.prototype.slice.call(arguments, 1);

        for (let source of args) {
            if (!source) { continue; }

            for (let prop in source) {
                let value = source[prop];
                if (!obj[prop] && value) { obj[prop] = source[prop]; }
            }
        }

        return obj;
    }
};
Adapter.initClass();

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

module.exports = Adapter;