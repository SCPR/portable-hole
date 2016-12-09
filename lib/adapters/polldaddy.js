'use strict';

let StaticTemplate = require('./statictemplate');
const loadTemplate = require('../template-loader');

class Polldaddy extends StaticTemplate {
    static initClass() {
        this.prototype.className = "Polldaddy";
    
        // We have to figure out the template dynamically.
        this.Template = null;

        this.templates = {
            polldaddy_survey: loadTemplate('polldaddy_survey'),
            polldaddy_poll  : loadTemplate('polldaddy_poll')
        };
    
        this.QueryDefaults = {
            maxwidth  : 620,
            maxheight : 550,
            format    : 'json'
        };
    
        this.Matchers = [
            new RegExp(/https?:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)\/?/i)
        ];
    }

    swap() {
        let match = this._parseUrl();
        if (!match) { return false; }

        let domain  = match[1];
        let type    = match[2];
        let id      = match[3];

        let template = this._findTemplate(type);

        let oldDocumentWrite = document.write;
        document.write = html => this.wrapper.append(html);

        this.embed(template({
            maxheight   : this.queryParams.maxheight,
            maxwidth    : this.queryParams.maxwidth,
            domain      : domain,
            id          : id
        }));

        super.swap();

        return setTimeout(() => document.write = oldDocumentWrite
        , 500);
    }

    _findTemplate(type) {
        let template = (() => { switch (type) {
            case 's': return 'polldaddy_survey';
            case 'poll': case 'p': return 'polldaddy_poll';
        } })();

        return Polldaddy.templates[template];
    }
};
Polldaddy.initClass();
module.exports = Polldaddy;
