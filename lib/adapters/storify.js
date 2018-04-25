'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate'),
      Utility        = require('../utility');

class Storify extends StaticTemplate {
    static initClass() {
        this.prototype.className = "Storify";
    
        this.Template = loadTemplate('storify');
    
        this.QueryDefaults = {
            maxwidth  : 550,
            maxheight : 750
        };
    
        // For storify, we just use the full URL, so no matchers are needed.
        this.Matchers = [];
    }


    swap() {
        // Storify's embed code doesn't provide a protocol (http/s), so let's
        // strip it out. We also want to make sure that there is no trailing
        // slash so that we can concatenate other things to the URL.
        let url = Utility.stripProtocol(
                Utility.stripTrailingSlash(this.href));

        // Storify embed is responsive, so we don't need to provide a width.
        let result = this.embed(Storify.Template({
            maxheight   : this.queryParams.maxheight,
            url         : url
        }));
        super.swap();
        return result;
    }
};
Storify.initClass();
module.exports = Storify;