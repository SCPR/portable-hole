// StaticTemplate is for when you just want to hard-code the embed code
// into the /templates directory. This is either to avoid an expensive
// call to an oEmbed endpoint, or if there simply isn't another way to
// programatically retrieve the embed code.
//
// Your StaticTemplate adapter SHOULD define:
// * @Template      - The name of the template to use (in the templates
//                    directory)
// * @QueryDefaults - The default query paramters if no others are passed in.
//
// Your StaticTemplate adapter MAY define:
// * @Matchers - An array of regular expressions which will be used to extract
//               important information from the URL (such as an ID).
//               If your adapter doesn't need a Matcher, then you don't have to
//               define this property. This property is used by _parseUrl(),
//               which doesn't get called automatically.
//

'use strict';

let Adapter      = require('../adapter');

class StaticTemplate extends Adapter {
    static initClass() {
        this.prototype.className = "StaticTemplate";
    
        // The template to use.
        this.Template = null;
    
        // Query parameter defaults
        this.QueryDefaults = {};
    
        // The matchers to extract the info out of the URL.
        this.Matchers = [];
    }


    swap() {
        // Extract the info and render the template
        
    }


    _parseUrl() {
        let match = null;

        _.find(this.adapter.Matchers, m => {
            return match = m.exec(this.href);
        });

        return match;
    }
};
StaticTemplate.initClass();
module.exports = StaticTemplate;
