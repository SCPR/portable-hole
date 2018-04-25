'use strict';

const { assert }       = require('chai'),
        cheerio        = require('cheerio'),
      { readFileSync } = require('fs'),
        PortableHoles  = require('../dist/portable-holes');

describe('adapters/youtube', function(){
  it('inserts a video', function(done){
    const $ = cheerio.load(readFileSync(`${__dirname}/mock/placeholders/youtube.html`, 'utf8')),
    holes   = new PortableHoles({$: $});
    holes.on('complete', () => {
      assert.equal($('.embed-placeholder').length, 0);
      assert.equal($('iframe').length, 1);
      assert.match($.html(), /https:\/\/www.youtube.com\/embed/);
      done();
    });
    holes.swap();
  });
});

