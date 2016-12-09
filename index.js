'use strict';

let cheerio = require('cheerio');
let $       = cheerio.load(`<a class="embed-placeholder" data-placement="replace" data-service="youtube" href="https://www.youtube.com/watch?v=e4lqyib3QPE" title="https://www.youtube.com/watch?v=e4lqyib3QPE">RAMMSTEIN IST FUR IMMER</a>`);
$.ajax      = require('najax');

module.exports = require('./dist/portable-holes');
