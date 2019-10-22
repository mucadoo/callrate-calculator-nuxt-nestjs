const { attributes } = require('structure');

const DDD = attributes({
  id: Number,
  code: String
})(class DDD {

});

module.exports = DDD;
