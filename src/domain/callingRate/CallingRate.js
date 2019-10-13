const { attributes } = require('structure');

const CallingRate = attributes({
  id: Number,
  originDDDId: Number,
  destinationDDDId: Number,
  ratePerMin: Number
})(class CallingRate {

});

module.exports = CallingRate;
