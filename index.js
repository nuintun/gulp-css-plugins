/**
 * @module index
 * @license MIT
 * @version 2018/03/29
 */

'use strict';

const postcss = require('postcss');
const cssnano = require('cssnano');
const { extname } = require('path');
const autoprefixer = require('autoprefixer');

/**
 * @function isFileType
 * @param {string} path
 * @param {string} type
 * @returns {boolean}
 */
const isFileType = (path, type) => extname(path).toLowerCase() === `.${type}`;

/**
 * @function css
 * @param {Object} options
 */
module.exports = function (options = {}) {
  options.cssnano = options.cssnano || {};
  options.autoprefixer = Object.assign(
    {
      add: true,
      remove: true
    },
    options.autoprefixer
  );
  options.cssnano.from = undefined;
  options.cssnano.autoprefixer = options.autoprefixer;

  return {
    name: 'gulp-css-plugins',
    async moduleDidComplete(path, contents) {
      if (!isFileType(path, 'css')) return contents;

      // Get contents string
      contents = contents.toString();

      // Process css file
      const result = options.minify
        ? await cssnano.process(contents, options.cssnano)
        : await postcss(autoprefixer(options.autoprefixer)).process(contents, { from: path });

      contents = result.css;

      return contents;
    }
  };
};
