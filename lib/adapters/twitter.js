'use strict';

const loadTemplate = require('../template-loader');
let StaticTemplate = require('./statictemplate');

class Twitter extends StaticTemplate {
    static initClass() {
        this.prototype.className = "Twitter";
    
        this.Template = loadTemplate('twitter');
        
        // Twitter doesn't give a damn about you or your dimensions.
        this.QueryDefaults = {};
    
        // For twitter, we just use the full URL, so no matchers are needed.
        this.Matchers = [];
    }

    swap() {
        return this.embed(Twitter.Template({url : this.href}));
    }
};
Twitter.initClass();
module.exports = Twitter;