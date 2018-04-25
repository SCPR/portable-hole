'use strict';

const { assert }           = require('chai'),
        cheerio            = require('cheerio'),
      { Writable,
        Transform }        = require('stream'),
        spawnStream        = require('spawn-stream'),
      { createReadStream } = require('fs'),
        childProcess   = require('child_process'),
        PortableHoles  = require('../dist/portable-holes');

require('fast-text-encoding');

const decode = new TextDecoder().decode;

describe('bin/portable-holes', function(){
  it('does its job', function(done){
    const t = new Transform();
    t._transform = function(chunk, encoding, next){
      this.push(chunk);
      this.push(null);
      next();
    };
    const w = new Writable();
    w._write = function(chunk, encoding, next){
      const $ = cheerio.load(decode(chunk));
      assert.equal($('.embed-placeholder').length, 0);
      assert.equal($('iframe').length, 1);
      assert.match($.html(), /https:\/\/www.youtube.com\/embed/);
      next(), done();
    };
    const child = childProcess.spawn(`${__dirname}/../bin/portable-holes`);
    child.stdout
      .pipe(w);
    createReadStream(`${__dirname}/mock/placeholders/youtube.html`, {encoding: 'utf8'})
      .pipe(t)
      .pipe(child.stdin);
  });
});

