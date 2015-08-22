var expect = require('chai').expect;
var looksSame = require('looks-same');
var PNGFill = require('../index.js');
var fs = require('fs');
var path = require('path');

describe('png-fill', function() {
  var source = fs.readFileSync(path.join(__dirname, 'test.png')),
      baseline = fs.readFileSync(path.join(__dirname, 'rect.png')),
      options = {
        output: 'buffer',
        rect: {
          top: 100,
          left: 200,
          width: 200,
          height: 100
        }
      },
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

  describe('Fill', function() {
    it('should fill the image with right and bottom params', function(done) {
      var rect = {
        left: 200,
        top: 100,
        right: 400,
        bottom: 200
      };

      var options = {
        rect: rect,
        output: 'buffer'
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.be.null;

        looksSame(baseline, data, function(error, equal) {
          if (error) {
            throw error;
          }

          expect(equal).to.be.true;
          done();
        });
      });
    });

    it('should fill the image with width and height params', function(done) {
      PNGFill(source, options, function(error, data) {
        expect(error).to.be.null;

        looksSame(baseline, data, function(error, equal) {
          if (error) {
            throw error;
          }

          expect(equal).to.be.true;
          done();
        });
      });
    });

    it('should throw an error if left and top params are outside the image',
       function(done) {
      var rect = {
        left: 501,
        top: 100,
        right: 400,
        bottom: 200
      };

      var options = {
        rect: rect,
        output: 'buffer'
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;
      });

      rect.left = 200;
      rect.top = 400;

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;
        done();
      });
    });
  });
});
