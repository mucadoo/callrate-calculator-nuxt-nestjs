const { attributes } = require('structure');

const CallingPlan = attributes({
  id: Number,
  name: String,
  minutes: Number,
  exceededMinutesPercent: Number
})(class CallingPlan {

});

module.exports = CallingPlan;
