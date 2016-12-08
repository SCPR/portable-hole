'use strict';

let cheerio = require('cheerio');
let $       = cheerio.load(`<a class="embed-placeholder" data-placement="replace" data-service="youtube" href="https://www.youtube.com/watch?v=e4lqyib3QPE" title="https://www.youtube.com/watch?v=e4lqyib3QPE">RAMMSTEIN IST FUR IMMER</a>`);
let najax   = require('najax');
$.ajax      = najax;

let PortableHole = require('./portable-hole/portable-hole')({$: $});

let hole = new PortableHole({
  Embedly: {
    query: { key : '0cb3651dde4740db8fcb147850c6b555' }
  }
})

debugger

hole.swap();