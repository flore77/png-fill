var PNG = require('pngjs2').PNG;
var streamify = require('stream-converter');

/*
 * Calculates the coord of the rectangle margins
 *
 * @param {Object} options.rect - Sama as DOMRect
 */
function getCoord(rect) {
  if (rect === undefined) {
    throw new Error('You have not provided the rect property');
  }

  var coord = {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom || rect.top + rect.height,
    right: rect.right || rect.left + rect.width
  };

  var prop = null;

  for (prop in coord) {
    if (coord[prop] === undefined) {
      throw new Error('Not enough rect properties to define rectangle coord');
    }
  }

  return coord;
}

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
module.exports  = function(source, options, callback) {

  if (source === undefined) {
    throw new Error('You have not provided any source');
  }

  if (options === undefined) {
    throw new Error('You have not provided any options');
  }

  if (typeof options !== 'object' || options instanceof Array) {
    throw new Error('The provided options param is not an object');
  }

  if (callback === undefined) {
    throw new Error('You have not provided any callback');
  }

  if (typeof callback !== 'function') {
    throw new Error('The provided callback is not a function');
  }

  var png = streamify(source, {path: true}).pipe(new PNG());
  var coord = getCoord(options.rect);
};

/**
 * @callback fillCb
 * @param error
 * @param {Stream|Buffer} [data]
 */
