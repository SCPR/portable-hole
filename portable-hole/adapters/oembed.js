// Oembed adapters MUST define:
// * @Endpoint      - The URL to the oembed endpoint
//
// Oembed adapters SHOULD defined:
// * @QueryDefaults - The fallback query parameters if no others are specified.

'use strict';

const _     = require('underscore')._;
let Adapter = require('../adapter');

class Oembed extends Adapter {
    static initClass() {
        this.prototype.className = "Oembed";
    
        // @Override
        //
        // The Oembed endpoint for the adapter.
        // Example: http://projects.scpr.org/firetracker/oembed
        this.Endpoint = null;
    }


    swap() {
        return this.$.ajax({
            url         : this.adapter.Endpoint,
            type        : 'GET',
            dataType    : 'json',
            data        :  _.extend(this.queryParams, {url: this.href}),

            success: (data, textStatus, jqXHR) => {
                return this.embedData(data);
            },

            error: (jqXHR, textStatus, errorThrown) => {
                return console.log('[portable-hole oembed] error.', jqXHR);
            }
        });
    }


    // Embed differently based on the oEmbed response we got.
    //
    // If we have data.html, then use it.
    // If not, then that could mean one of a few things:
    // * It's a `photo` type, which we handle by just wrapping an <img> tag
    //   around the URL.
    // * It's a `link` type, which we can just leave alone because the
    //   embed placeholder is already there.
    // * It's an invalid oEmbed response, which we should also just leave alone
    //   and let the link serve its purpose.
    embedData(data) {
        if (data.html) { return this.embed(data.html); }
        if (data.type === 'photo') { return this._embedPhoto(data); }
    }



    // Embed a photo.
    // Pass in an object containing:
    // * URL to the image
    // * width of the image
    // * height of hte image
    _embedPhoto(data) {
        let img = $('<img />', {
            src     : data.url,
            width   : data.width,
            height  : data.height
        });

        return this.embed(img);
    }
};
Oembed.initClass();
module.exports = Oembed;