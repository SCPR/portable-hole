'use strict';

const Oembed = require('./oembed');

class Embedly extends Oembed { };

Embedly.prototype.className = 'Embedly';
    
Embedly.Endpoint = 'https://api.embed.ly/1/oembed';

// This object should hold any keys that we want to
// send to the API. Any key not in this object will
// be ignored as a data attribute.
Embedly.QueryDefaults = {
    maxheight   : null,
    maxwidth    : 650 // Without this, height is just at the maximum.
};

module.exports = Embedly;

