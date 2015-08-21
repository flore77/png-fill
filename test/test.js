var expect = require('chai').expect;
var PNGFill = require('../index.js');

describe('png-fill', function() {
  var source = new Buffer('anything'),
      callback = function() {};

  describe('Parameters checking', function() {
    it('should throw an error if no source is provided', function() {
      expect(PNGFill.bind(null)).to.throw(Error);
    });

    it('should throw an error if no options is provided', function() {
      expect(PNGFill.bind(null, source)).to.throw(Error);
    });

    it('should throw an error if options is not an object', function() {
      expect(PNGFill.bind(null, source, 'not object')).to.throw(Error);
    });

    it('should throw an error if options is an array', function() {
      expect(PNGFill.bind(null, source, [])).to.throw(Error);
    });

    it('should throw an error if no callback is provided', function() {
      expect(PNGFill.bind(null, source, {})).to.throw(Error);
    });

    it('should throw an error if the callback is not a function', function() {
      expect(PNGFill.bind(null, source, {}, {})).to.throw(Error);
    });
  });

  describe('Rectangle Coord', function() {
    it('should throw an error if the options obj has no rect prop', function() {
      expect(PNGFill.bind(null, source, {}, callback)).to.throw(Error);
    });

    it('should throw an error if the rectangle coord cannot be calculated',
       function() {
      var options = {
            rect: {
              top: 50
            }
          };

      expect(PNGFill.bind(null, source, options, callback)).to.throw(Error);
    });
  });
});
