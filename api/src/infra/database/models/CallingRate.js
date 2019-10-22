'use strict';

module.exports = function (sequelize, DataTypes) {
  const CallingRate = sequelize.define('callingRate', {
    ratePerMin: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function (models) {
        CallingRate.belongsTo(models.DDD, {
          foreignKey: 'originDDDId',
          as: 'originDDD',
        });
        CallingRate.belongsTo(models.DDD, {
          foreignKey: 'destinationDDDId',
          as: 'destinationDDD',
        });
      }
    }
  });

  return CallingRate;
};
