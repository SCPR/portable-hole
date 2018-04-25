'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class Twitter extends StaticTemplate {
  swap() {
    this.embed(Twitter.Template({
      url: this.href
    }));
    super.swap();
  }
}

Twitter.prototype.className = 'Twitter';

Twitter.Template = loadTemplate('twitter');

// Twitter doesn't give a damn about you or your dimensions.
Twitter.QueryDefaults = {};

// For twitter, we just use the full URL, so no matchers are needed.
Twitter.Matchers = [];

module.exports = Twitter;

