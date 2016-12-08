'use strict';

let cheerio = require('cheerio');
let $       = cheerio.load(`<a class="embed-placeholder" data-placement="replace" data-service="youtube" href="https://www.youtube.com/watch?v=e4lqyib3QPE" title="https://www.youtube.com/watch?v=e4lqyib3QPE">RAMMSTEIN IST FUR IMMER</a>`);
let najax   = require('najax');
$.ajax      = najax;

let PortableHoles = require('./lib/portable-holes')({$: $});

let hole = new PortableHoles({
  Embedly: {
    query: { key : '0cb3651dde4740db8fcb147850c6b555' }
  }
})

debugger

hole.swap();