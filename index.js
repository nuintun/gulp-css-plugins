/**
 * @module index
 * @license MIT
 * @version 2017/11/13
 */

'use strict';

const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

/**
 * @function css
 * @param {Object} options
 */
module.exports = function(options) {
  options = options || {};
  options.cssnano = options.cssnano || {};

  options.autoprefixer = Object.assign(
    {
      add: true,
      remove: true,
      browsers: ['> 0.5% in CN', '> 1%', 'ie >= 8']
    },
    options.autoprefixer
  );

  // Open cssnano use safe mode
  options.cssnano.safe = true;
  options.cssnano.autoprefixer = options.autoprefixer;

  const addons = {};

  if (options.minify) {
    addons.css = [
      'inline-loader',
      function(vinyl) {
        return new Promise((resolve, reject) => {
          cssnano
            .process(vinyl.contents.toString(), options.cssnano)
            .then(result => {
              vinyl.contents = new Buffer(result.css);

              resolve(vinyl);
            })
            .catch(error => {
              reject(error);
            });
        });
      }
    ];
  } else {
    addons.css = function(vinyl) {
      return new Promise((resolve, reject) => {
        postcss(autoprefixer(options.autoprefixer))
          .process(vinyl.contents.toString())
          .then(result => {
            vinyl.contents = new Buffer(result.css);

            resolve(vinyl);
          })
          .catch(error => {
            reject(error);
          });
      });
    };
  }

  return addons;
};
