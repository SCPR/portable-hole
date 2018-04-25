'use strict';

const path          = require('path'),
      glob          = require('glob'),
      EventEmitter  = require('events'),
    { assign }      = Object,
      PortableHoles = require('./defaults');

PortableHoles.Adapters = {};

/**
 * Easily replace embed placeholders with actual embeds.
 * @property {boolean} isComplete - Indicates if placeholder-swapping has been completed.
 * @extends EventEmitter
 */
class Base extends EventEmitter {
    /**
     * @param {object} options
     * @param {object} options.$ - A jQuery instance to be used.  It will otherwise default to a globally-defined $.  
     * @param {string='Embedly'} options.defaultAdapter - Adapter that gets used when the service isn't recognized.
     * @param {string='other'}   options.defaultServer  - Service that gets used when the `data-service` attribute is
  missing.
     * @param {string='embed-placeholder'} options.placeholderClass - The class that the embed placeholders are given.
     * @param {string='embed-wrapper'}     options.wrapperClass     - The class the embed's wrapper is given.
     * @param {string='div'}               options.wrapperElement   - The element which should be wrapped around all embeds.
     * @param {string='after}              options.defaultPlacement - Default embed placement, if a placement is somehow
  missing or it doesn't exist in the PlacementFunctions object.
     * @param {object} adapters  - A table of adapters to be used.  These determine what embeds will be inserted. 
     */
    constructor(options={}, adapters={}) {
        super()
        const $ = (typeof window === 'undefined') ? global.$ : window.$;
        this.options      = assign({}, PortableHoles.DefaultOptions, options);
        this.adapters     = assign({}, PortableHoles.DefaultAdapters, adapters);
        this.$            = options.$ || $;
        this.placeholders = [];
        this.links        = this.$(this._classify(this.options.placeholderClass));
        this._findEmbeds();
    }
    /**
     * Performs the crawl over the DOM to swap placeholders for embeds.
     * Emits a 'complete' event when finished.
     */
    swap() {
        if(!this.placeholders.length) return this._triggerComplete();
        this.placeholders.forEach(placeholder => {
            placeholder.on('swap', () => this._triggerComplete());
            placeholder.swap();
        });
    }

    get isComplete(){
        // check every placeholder to see if they have been marked as complete
        return this.placeholders.every(p => p.isComplete);
    }

    _triggerComplete() {
        if(this.isComplete) this.emit('complete');
    }

    _findEmbeds() {
        const len = this.links.length;
        let i = 0;
        while(i<len){
            const link = this.$(this.links[i]);

            // If "service" is blank in the CKEditor dialog, then it will
            // omit that data-attribute from the tag, and therefore
            // be undefined. In this scenario, we want to use the default
            // service as a fallback.
            //
            // If "service" is present but has no match in the Adapters object,
            // then we want to use the default handler as a fallback.
            const service     = link.data('service')   || this.options.defaultService,
                  adapterName = this.adapters[service] || this.options.defaultAdapter,
                  adapter     = PortableHoles.Adapters[adapterName];

            if (!adapter) return;

            const placeholder = new adapter(this.$, link, this.options);
            this.placeholders.push(placeholder);

            i++;
        }

    }

    _classify(str) {
        return `.${str}`;
    }
};

PortableHoles.Base = Base;

// Load the adapter classes
glob.sync(`${__dirname}/adapters/*.js`).forEach(file => {
    let adapterName = file.match(/\/([\w|\-]+)\.js/)[1]
    if(adapterName) PortableHoles.Adapters[adapterName] = require(file);
})

module.exports = Base;

