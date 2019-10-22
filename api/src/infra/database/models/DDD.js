'use strict';

module.exports = function (sequelize, DataTypes) {
  const DDD = sequelize.define('ddd', {
    code: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        DDD.hasMany(models.CallingRate, {
          foreignKey: 'originDDDId',
          as: 'originCallingRate',
        });
        DDD.hasMany(models.CallingRate, {
          foreignKey: 'destinationDDDId',
          as: 'destinationCallingRate',
        });
      }
    }
  });

  return DDD;
};
