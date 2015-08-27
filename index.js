var PNG = require('pngjs2').PNG;
var streamify = require('stream-converter');
var parseColor = require('parse-color');
var concat = require('concat-stream');
var fs = require('fs');

/*
 * Calculates the coord of the rectangle margins
 *
 * @param {Object} options.rect - Same as DOMRect
 */
function getCoord(rect) {
  var coord = {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom || rect.top + rect.height,
    right: rect.right || rect.left + rect.width
  };

  var prop = null;

  for (prop in coord) {
    if (coord[prop] === undefined || isNaN(coord[prop])) {
      return null;
    }
  }

  return coord;
}

/**
 * Parse a color from string to RGB
 *
 * @param {String} color - A css color
 */
function parseColorToRGB(color) {
  if (color === undefined) {
    color = 'black';
  }

  var parsedColor = parseColor(color);

  return {
    R: parsedColor.rgb[0],
    G: parsedColor.rgb[1],
    B: parsedColor.rgb[2]
  };
}

/**
 * Returns the PNG under the specified format
 *
 * @param {Stream} png
 * @param {String} format
 * @param {String} path
 * @param done
 */
function output(png, type, path, done) {
  if (type === 'file') {
    if (path === undefined) {
      return done(new Error('There is no path to save the PNG image'));
    }

    png.pipe(fs.createWriteStream(path))
      .on('error', done)
      .on('close', function() {
        done(null);
      });
  } else if (type === 'buffer') {
    png.pipe(concat(function(data) {
      done(null, data);
    }));

    png.on('error', done);
  } else {
    done(null, png);
  }
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
module.exports = function(source, options, callback) {

  if (source === undefined) {
    throw new Error('You have not provided any source');
  }

  if (options === undefined) {
    throw new Error('You have not provided any options');
  }

  if (typeof options !== 'object' || options instanceof Array) {
    throw new Error('The provided options param is not an object');
  }

  if (options.rect === undefined) {
    throw new Error('You have not provided the rect property');
  }

  if (callback === undefined) {
    throw new Error('You have not provided any callback');
  }

  if (typeof callback !== 'function') {
    throw new Error('The provided callback is not a function');
  }

  var coord = getCoord(options.rect);

  if (coord === null) {
    return callback(new Error('Not enough rect properties to calculate ' +
      'rectangle coord'));
  }

  var png = streamify(source, {path: true}).pipe(new PNG());
  var color = parseColorToRGB(options.color);

  png.on('error', callback);

  png.on('parsed', function() {
    var width = Math.min(coord.right, this.width - 1);
    var height = Math.min(coord.bottom, this.height - 1);

    if (coord.top < 0 || coord.top > height ||
        coord.left < 0 || coord.left > width) {
      return callback(new Error('The top or the left coord are outside ' +
        'the image'));
    }

    for (var y = coord.top; y <= height; y++) {
      for (var x = coord.left; x <= width; x++) {
        var index = (this.width * y + x) << 2;

        this.data[index] = color.R;
        this.data[index + 1] = color.G;
        this.data[index + 2] = color.B;
      }
    }

    output(png.pack(), options.output, options.path, callback);
  });
};

/**
 * @callback fillCb
 * @param error
 * @param {Stream|Buffer} [data]
 */
