'use strict';

var postcss = require('postcss');
var cssnano = require('cssnano');
var css = require('@nuintun/gulp-css');
var autoprefixer = require('autoprefixer');

var defAddons = css.defaults.plugins;

module.exports = function(options) {
  options = options || {};
  options.cssnano = options.cssnano || {};

  options.autoprefixer = Object.assign({
    add: true,
    remove: true,
    browsers: ['> 1% in CN', '> 5%', 'ie >= 8']
  }, options.autoprefixer);

  // cssnano use safe mode
  options.cssnano.safe = true;
  options.cssnano.autoprefixer = options.autoprefixer;

  var addons = {};

  if (options.minify) {
    addons.css = function(vinyl, opts, next) {
      var context = this;

      cssnano
        .process(vinyl.contents.toString(), options.cssnano)
        .then(function(result) {
          vinyl.contents = new Buffer(result.css);

          defAddons.css.process(vinyl, opts, function(vinyl) {
            context.push(vinyl);
            next();
          });
        });
    };
  } else {
    addons.css = function(vinyl, opts, next) {
      var context = this;

      postcss(autoprefixer(options.autoprefixer))
        .process(vinyl.contents.toString())
        .then(function(result) {
          vinyl.contents = new Buffer(result.css);

          defAddons.css.process(vinyl, opts, function(vinyl) {
            context.push(vinyl);
            next();
          });
        });
    };
  }

  return addons;
};
