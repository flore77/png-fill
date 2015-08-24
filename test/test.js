var expect = require('chai').expect;
var looksSame = require('looks-same');
var PNGFill = require('../index.js');
var fs = require('fs');
var path = require('path');

describe('png-fill', function() {
  var source = fs.readFileSync(path.join(__dirname, 'test.png')),
      baseline = fs.readFileSync(path.join(__dirname, 'rect.png')),
      pathImg = path.join(__dirname, 'img.png');
      options = {
        output: 'buffer',
        rect: null
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
      options.rect = {
        top: 50
      };

      expect(PNGFill.bind(null, source, options, callback)).to.throw(Error);
    });
  });

  describe('Fill', function() {
    it('should fill the image with right and bottom params', function(done) {
      options.rect = {
        left: 200,
        top: 100,
        right: 400,
        bottom: 200
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
      options.rect = {
          top: 100,
          left: 200,
          width: 200,
          height: 100
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

    it('should call the cb with error if left param is outside the image',
       function(done) {
      options.rect = {
        left: 501,
        top: 100,
        right: 400,
        bottom: 200
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;

        done();
      });
    });

    it('should call the cb with error if top param is outside the image',
       function(done) {
      options.rect = {
        left: 200,
        top: 400,
        right: 400,
        bottom: 200
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;

        done();
      });
    });

   it('should call the cb with error if left param is neagtive',
       function(done) {
      options.rect = {
        left: -15,
        top: 400,
        right: 400,
        bottom: 200
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;

        done();
      });
    });

   it('should call the cb with error if top param is negative',
       function(done) {
      options.rect = {
        left: 200,
        top: -15,
        right: 400,
        bottom: 200
      };

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;

        done();
      });
    });

    it('should save the image on disk if a path is provided', function(done) {
      options.output = 'file';
      options.path = pathImg;
      options.rect = {
        top: 100,
        left: 200,
        width: 200,
        height: 100
      };

      PNGFill(source, options, function(error) {
        expect(error).to.be.null;

        looksSame(baseline, options.path, function(error, equal) {
          if (error) {
            throw error;
          }

          expect(equal).to.be.true;
          done();
        });
      });
    });


    it('should call the cb with error if there is no path', function(done) {
      options.path = undefined;

      PNGFill(source, options, function(error, data) {
        expect(error).to.not.be.null;
        expect(data).to.be.undefined;
        done();
      });
    });

    it('should return a stream if no output options is provided',
       function(done) {
      options.output = null;

      PNGFill(source, options, function(error, stream) {
        expect(error).to.be.null;

        stream.pipe(fs.createWriteStream(pathImg));

        looksSame(baseline, pathImg, function(error, equal) {
          if (error) {
            throw error;
          }

          expect(equal).to.be.true;
          done();
        });
      });
    });

    after(function() {
      fs.unlinkSync(pathImg);
    });
  });
});
