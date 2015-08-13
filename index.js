var PNG = require('pngjs2').PNG;

/**
 *
 * @param {String|Stream|Buffer} source - The source image
 * @param {Object} options
 * @param {Object} options.rect - Same as DOMRect
 * @param {String} [options.output] - How the resulting png will be output
 * @param {String} [options.color] - The color to fill with
 * @param {Number} options.rect.top
 * @param {Number} options.rect.left
 * @param {Number} [options.rect.bottom]
 * @param {Number} [options.rect.right]
 * @param {Number} [options.rect.width]
 * @param {Number} [options.rect.height]
 * @param {fillCb} callback
 */
module.exports.fill = function(source, options, callback) {

};

/**
 * @callback fillCb
 * @param error
 * @param {Stream|Buffer} [data]
 */
