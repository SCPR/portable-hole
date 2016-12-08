'use strict';

const path               = require('path');
const fs                 = require('fs');
const glob               = require('glob');
const _                  = require('underscore')._;

module.exports = (options) => {
    const $        = options.$;
    const document = $(':root').context;

    let PortableHole = require('./defaults');

    PortableHole.Adapters = {};

    PortableHole.Base = class Base {
        constructor(options, adapters) {
            options  = options  || {};
            adapters = adapters || {};
            this.options    = _.defaults(options,  PortableHole.DefaultOptions);
            this.adapters   = _.defaults(adapters, PortableHole.DefaultAdapters);

            this.placeholders = [];

            this.links = $(this._classify(this.options.placeholderClass));

            this.findEmbeds();
        }


        swap() {
            return this.placeholders.map((placeholder) => placeholder.swap());
        }


        findEmbeds() {

            let i = 0;
            while(i<this.links.length){
                let link = this.links[i];

                link = $(link);

                // If "service" is blank in the CKEditor dialog, then it will
                // omit that data-attribute from the tag, and therefore
                // be undefined. In this scenario, we want to use the default
                // service as a fallback.
                //
                // If "service" is present but has no match in the Adapters object,
                // then we want to use the default handler as a fallback.
                let service         = link.data('service') || this.options.defaultService;
                let adapterName     = this.adapters[service] || this.options.defaultAdapter;
                let adapter         = PortableHole.Adapters[adapterName];

                if (!adapter) { return; }

                let placeholder = new adapter($, link, this.options);
                this.placeholders.push(placeholder);

                i++
            }

            // for (let link of this.links) {

            // }
        }


        _classify(str) {
            return `.${str}`;
        }
    };

    // Load the adapter classes

    glob.sync(`./portable-hole/adapters/*.js`).forEach((file) => {
        let adapterName = file.match(/\/([\w|\-]+)\.js/)[1]
        if(adapterName){
            PortableHole.Adapters[adapterName] = require(path.resolve(file));
        }
    })

    // Load templates

    // glob.sync(`./portable-hole/templates/*.hbs`).forEach((file) => {
    //     let templateName = file.match(/\/([\w|\-]+)\.hbs/)[1]
    //     if(templateName){
    //         let source = fs.readFileSync(path.resolve(file), 'utf8');
    //         PortableHole.Templates[templateName] = Handlebars.compile(source);
    //     }
    // })

    return PortableHole.Base;
}
