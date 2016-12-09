'use strict';

const path               = require('path');
const fs                 = require('fs');
const glob               = require('glob');
const _                  = require('underscore')._;
const Eventable          = require('./eventable');

let PortableHoles = require('./defaults');

PortableHoles.Adapters = {};

PortableHoles.Base = class Base extends Eventable {
    constructor(options, adapters) {
        super()
        options  = options  || {};
        adapters = adapters || {};
        this.options    = _.defaults(options,  PortableHoles.DefaultOptions);
        this.adapters   = _.defaults(adapters, PortableHoles.DefaultAdapters);
        this.$          = options.$;

        this.placeholders = [];

        this.links = this.$(this._classify(this.options.placeholderClass));

        this.findEmbeds();
    }


    swap() {
        if(this.placeholders.length){
            return this.placeholders.forEach((placeholder) => {
                placeholder.on('swap', () => { 
                    this._triggerComplete();
                });
                placeholder.swap();
            });           
        } else {
            this._triggerComplete();
        }
    }

    _triggerComplete() {
        // check every placeholder to see if they have been marked as complete
        let isComplete = _.every(this.placeholders, (p) => { return p.isComplete; });
        if(isComplete){
            this.trigger('complete');
        }
    }


    findEmbeds() {

        let i = 0;
        while(i<this.links.length){
            let link = this.links[i];

            link = this.$(link);

            // If "service" is blank in the CKEditor dialog, then it will
            // omit that data-attribute from the tag, and therefore
            // be undefined. In this scenario, we want to use the default
            // service as a fallback.
            //
            // If "service" is present but has no match in the Adapters object,
            // then we want to use the default handler as a fallback.
            let service         = link.data('service') || this.options.defaultService;
            let adapterName     = this.adapters[service] || this.options.defaultAdapter;
            let adapter         = PortableHoles.Adapters[adapterName];

            if (!adapter) { return; }

            let placeholder = new adapter(this.$, link, this.options);
            this.placeholders.push(placeholder);

            i++
        }

    }


    _classify(str) {
        return `.${str}`;
    }
};

// Load the adapter classes
glob.sync(`./lib/adapters/*.js`).forEach((file) => {
    let adapterName = file.match(/\/([\w|\-]+)\.js/)[1]
    if(adapterName){
        PortableHoles.Adapters[adapterName] = require(`.${file}`);
    }
})

module.exports = PortableHoles.Base;

