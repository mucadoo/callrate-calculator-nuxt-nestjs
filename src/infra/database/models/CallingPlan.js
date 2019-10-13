'use strict';

module.exports = function (sequelize, DataTypes) {
  const CallingPlan = sequelize.define('callingPlan', {
    name: DataTypes.STRING,
    minutes: DataTypes.INTEGER,
    exceededMinutesPercent: DataTypes.DOUBLE
  }, {
    classMethods: {}
  });

  return CallingPlan;
};
