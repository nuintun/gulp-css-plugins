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
 * @function toBuffer
 * @param {string} string
 * @returns {Buffer}
 */
const toBuffer = Buffer.from ? Buffer.from : string => new Buffer(string);

/**
 * @function isCSSFile
 * @param {string} path
 * @returns {boolean}
 */
const isCSSFile = path => extname(path).toLowerCase() === '.css';

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

  return {
    name: 'gulp-css-plugins',
    async transform(path, contents) {
      if (options.minify || !isCSSFile(path)) return contents;

      contents = contents.toString();

      const result = await postcss(autoprefixer(options.autoprefixer)).process(contents, { from: path });

      contents = result.css;

      return toBuffer(contents);
    },
    async bundle(path, contents) {
      if (options.minify && isCSSFile(path)) {
        contents = contents.toString();

        const result = await cssnano.process(vinyl.contents.toString(), options.cssnano);

        contents = result.css;

        return toBuffer(contents);
      }

      return contents;
    }
  };
};
