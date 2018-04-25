'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class RebelMouse extends StaticTemplate {
    static initClass() {
        this.prototype.className = "RebelMouse";
    
        this.Template = loadTemplate('rebel_mouse');
    
        this.QueryDefaults = {
            maxwidth  : 620,
            maxheight : 1000
        };
    
        this.Matchers = [
            new RegExp(/rebelmouse\.com\/(.+?)\/?$/i)
        ];
    }

    swap() {
        let match = this._parseUrl();
        if (!match) { return false; }

        let site = encodeURIComponent(match[1]);

        let result = this.embed(RebelMouse.Template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            site        : site
        }));
        super.swap();
        return result;
    }
};
RebelMouse.initClass();
module.exports = RebelMouse;