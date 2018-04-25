'use strict';

let Oembed = require('./oembed');

class DocumentCloud extends Oembed {
    static initClass() {
        this.prototype.className = "DocumentCloud";
        this.Endpoint = "https://www.documentcloud.org/api/oembed.json";
    
        this.QueryDefaults = {
            maxheight   : 700,
            responsive  : true
        };
    }
};
DocumentCloud.initClass();
module.exports = DocumentCloud;
