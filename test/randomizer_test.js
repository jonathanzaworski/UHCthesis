var randomizer = require('../randomizer');

require('chai').should();

describe('Randomizer', function () {

  it('should return a random url', function () {
    var result = randomizer();
    console.log(result);
    result.should.be.ok;
  });

});
