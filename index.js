/*!
 * index
 *
 * Date: 2017/10/20
 *
 * This is licensed under the MIT License (MIT).
 */

'use strict';

var postcss = require('postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');

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
    addons.css = [
      'inline-loader',
      function(vinyl) {
        return new Promise(function(resolve, reject) {
          cssnano
            .process(vinyl.contents.toString(), options.cssnano)
            .then(function(result) {
              vinyl.contents = new Buffer(result.css);

              resolve(vinyl);
            })
            .catch(function(error) {
              reject(error);
            });
        });
      }
    ]
  } else {
    addons.css = function(vinyl) {
      return new Promise(function(resolve, reject) {
        postcss(autoprefixer(options.autoprefixer))
          .process(vinyl.contents.toString())
          .then(function(result) {
            vinyl.contents = new Buffer(result.css);

            resolve(vinyl);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    };
  }

  return addons;
};
