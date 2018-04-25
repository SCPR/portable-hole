'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class Facebook extends StaticTemplate {

  swap() {
    const match = this._parseUrl();
    if (!match) return false;
    const type  = match[2].replace(/s$/, '');
    this.embed(Facebook.Template({
      maxheight: this.queryParams.maxheight,
      maxwidth:  this.queryParams.maxwidth,
      type,
      isPost:    type.match('post') ? true : false,
      isVideo:   type.match('video') ? true : false, 
      username:  match[1],
      id:        match[3]
    }));
    super.swap();
  }

}

Facebook.className = 'Facebook';
Facebook.Template  = loadTemplate('facebook');

Facebook.QueryDefaults = {
  maxheight   : null,
  maxwidth    : 650
};

Facebook.Matchers = [
  /facebook.com\/(.*)\/(.*)\/(\d+)/
];

module.exports = Facebook;

