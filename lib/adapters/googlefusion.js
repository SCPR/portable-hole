'use strict';

const loadTemplate = require('../template-loader');
let StaticTemplate = require('./statictemplate');

class GoogleFusion extends StaticTemplate {
    static initClass() {
        this.prototype.className = "GoogleFusion";
    
        this.Template = loadTemplate('google_fusion');
    
        this.QueryDefaults = {
            maxwidth  : 620,
            maxheight : 550
        };
    
        this.Matchers = [];
    }

    swap() {
        let result = this.embed(GoogleFusion.Template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            url         : this.href
        }));
        super.swap();
        return result;
    }
};
GoogleFusion.initClass();
module.exports = GoogleFusion;