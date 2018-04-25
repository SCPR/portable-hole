'use strict';

const loadTemplate   = require('../template-loader'),
      StaticTemplate = require('./statictemplate');

class YouTube extends StaticTemplate {

  swap() {
    const match = this._parseUrl();
    if (!match) return false;

    const id       = match[5],
          template = (id.length > 11) ? YouTube.PlaylistTemplate : YouTube.VideoTemplate;
    
    this.embed(template({
      maxheight: this.queryParams.maxheight,
      maxwidth: this.queryParams.maxwidth,
      id: id
    }));
    super.swap();
  }

}

YouTube.className        = 'YouTube';
YouTube.VideoTemplate    = loadTemplate('youtube');
YouTube.PlaylistTemplate = loadTemplate('youtube_playlist');

YouTube.QueryDefaults = {
  maxwidth: 560,
  maxheight: 360
};

YouTube.Matchers = [
  /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/i,
  /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?list=|(embed|v)\/))([^\?&"'>]+)/i
];

module.exports = YouTube;

