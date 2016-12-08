'use strict';

let Oembed = require('./oembed');

class Embedly extends Oembed {
    static initClass() {
        this.prototype.className = "Embedly";
    
        this.Endpoint = "http://api.embed.ly/1/oembed";
    
        // This object should hold any keys that we want to
        // send to the API. Any key not in this object will
        // be ignored as a data attribute.
        this.QueryDefaults = {
            maxheight   : null,
            maxwidth    : 650 // Without this, height is just at the maximum.
        };
    }
};
Embedly.initClass();
module.exports = Embedly;