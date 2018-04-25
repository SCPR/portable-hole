'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class Brightcove extends StaticTemplate {
    static initClass() {
        this.prototype.className = 'Brightcove';

        this.Template = loadTemplate('brightcove');
    
        this.QueryDefaults = {
            maxwidth  : 620,
            maxheight : 550
        };
    
        this.Matchers = [
            new RegExp(/bcpid(\d+)\?bckey=([^&]+)/i)
        ];
    }

    swap() {
        let match = this._parseUrl();
        if (!match) return false;

        let playerId  = match[1];
        let playerKey = match[2];

        this.embed(Brightcove.Template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            playerId    : playerId,
            playerKey   : playerKey
        }));
        super.swap();
    }
};
Brightcove.initClass();
module.exports = Brightcove;
