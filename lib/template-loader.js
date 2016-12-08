'use strict';

const path               = require('path');
const fs                 = require('fs');
const Handlebars         = require('handlebars');

module.exports = (templateName) => {
  let source    = fs.readFileSync(path.resolve(`./lib/templates/${templateName}.hbs`), 'utf8');
  return Handlebars.compile(source);
}