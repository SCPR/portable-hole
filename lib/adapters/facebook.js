'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class Facebook extends StaticTemplate {

  swap() {
    const match = this._parseUrl();
    if (!match) return false;
    const type  = match[2].replace(/s$/, '');
    if(type === 'post'){
      this.embed(Facebook.Template({
        maxheight: this.queryParams.maxheight,
        maxwidth:  this.queryParams.maxwidth,
        username:  match[1],
        id:        match[3]
      }));
    } else if (type === 'video'){
      this.embed(Facebook.VideoTemplate({
        maxheight: this.queryParams.maxheight || 480,
        maxwidth:  this.queryParams.maxwidth  || 720,
        username:  match[1],
        id:        match[3]
      }));
    }
    super.swap();
  }

}

Facebook.className     = 'Facebook';
Facebook.Template      = loadTemplate('facebook');
Facebook.VideoTemplate = loadTemplate('facebook_video');

Facebook.QueryDefaults = {
  maxheight   : null,
  maxwidth    : 650
};

Facebook.Matchers = [
  /facebook.com\/(.*)\/(.*)\/(\d+)/
];

module.exports = Facebook;

