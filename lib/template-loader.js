'use strict';

const path           = require('path'),
    { readFileSync } = require('fs'),
      Handlebars     = require('handlebars');

module.exports = (templateName) => {
  let source = readFileSync(`${__dirname}/templates/${templateName}.hbs`, 'utf8');
  return Handlebars.compile(source);
}

