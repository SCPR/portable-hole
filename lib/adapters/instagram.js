'use strict';

const loadTemplate = require('../template-loader');
let StaticTemplate = require('./statictemplate');

// Instagram's oembed endpoint returns "photo" oembed types (instead of "rich"),
// and only a URL to the photo, not an actual embed code. Therefore, we need to
// use StaticTemplate to use the iframe embed code.

class Instagram extends StaticTemplate {
    static initClass() { 
        this.prototype.className = "Instagram";
    
        this.Template = loadTemplate('instagram');
    
        this.QueryDefaults = {
            maxwidth  : 612,
            maxheight : 710
        };
    
        this.Matchers = [
            // http://instagram.com/p/e8hJe6CvTW/
            new RegExp(/instagram\.com\/p\/([^\/]+)/i)
        ];
    }


    swap() {
        let match = this._parseUrl();
        if (!match) { return false; }

        let photoId = match[1];

        return this.embed(Instagram.Template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            photoId     : photoId
        })
        );
    }
};
Instagram.initClass();
module.exports = Instagram;