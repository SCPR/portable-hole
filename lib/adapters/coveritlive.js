'use strict';

const loadTemplate       = require('../template-loader');
const StaticTemplate     = require('./statictemplate');

class CoverItLive extends StaticTemplate {
    static initClass() {
        this.prototype.className = "CoverItLive";
    
        this.Template = loadTemplate('cover_it_live');
    
        this.QueryDefaults = {
            maxwidth  : 620,
            maxheight : 550
        };
    
        this.Matchers = [
            new RegExp(/\/altcast_code=([^\/]+)\//i)
        ];
    }

    swap() {
        // If the href doesn't match our known URL schemes
        // for this adapter, then let's not bother trying.
        let match = this._parseUrl();
        if (!match) { return false; }

        let eventId = match[1];

        return this.embed(CoverItLive.Template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            eventId     : eventId
        })
        );
    }
};
CoverItLive.initClass();
module.exports = CoverItLive;