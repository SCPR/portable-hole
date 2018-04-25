'use strict';

let Oembed = require('./oembed');

class FireTracker extends Oembed {
    static initClass() {
        this.prototype.className = 'FireTracker';
    
        this.Endpoint = 'http://firetracker.scpr.org/oembed';
    
        this.QueryDefaults = {
            maxwidth    : 510,
            maxheight   : 374,
            format      : 'json'
        };
    }
};
FireTracker.initClass();
module.exports = FireTracker;