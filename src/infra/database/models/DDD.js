'use strict';

module.exports = function (sequelize, DataTypes) {
  const DDD = sequelize.define('ddd', {
    code: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        DDD.hasMany(models.callingRate, {
          foreignKey: 'originDDDId',
          as: 'originCallingRate',
        });
        DDD.hasMany(models.callingRate, {
          foreignKey: 'destinationDDDId',
          as: 'destinationCallingRate',
        });
      }
    }
  });

  return DDD;
};
