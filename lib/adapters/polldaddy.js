'use strict';

const StaticTemplate = require('./statictemplate'),
      loadTemplate   = require('../template-loader');

class Polldaddy extends StaticTemplate {

  swap() {
    const match = this._parseUrl();
    if (!match) return false;

    const domain   = match[1],
          type     = match[2],
          id       = match[3],
          template = this._findTemplate(type);

    const oldDocumentWrite = document.write;
    document.write = html => this.wrapper.append(html);

    this.embed(template({
      maxheight: this.queryParams.maxheight,
      maxwidth: this.queryParams.maxwidth,
      domain: domain,
      id: id
    }));

    super.swap();

    return setTimeout(() => document.write = oldDocumentWrite, 500);
  }

  _findTemplate(type) {
    let template = (() => {
      switch (type) {
        case 's':
          return 'polldaddy_survey';
        case 'poll':
        case 'p':
          return 'polldaddy_poll';
      }
    })();
    return Polldaddy.templates[template];
  }
};

Polldaddy.prototype.className = "Polldaddy";

// We have to figure out the template dynamically.
Polldaddy.Template = null;

Polldaddy.templates = {
  polldaddy_survey: loadTemplate('polldaddy_survey'),
  polldaddy_poll:   loadTemplate('polldaddy_poll')
};

Polldaddy.QueryDefaults = {
  maxwidth: 620,
  maxheight: 550,
  format: 'json'
};

Polldaddy.Matchers = [
  new RegExp(/https?:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)\/?/i)
];

module.exports = Polldaddy;

