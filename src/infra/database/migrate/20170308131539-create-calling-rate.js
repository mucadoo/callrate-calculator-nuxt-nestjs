'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('callingRate', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      originDDDId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ddd',
          key: 'id',
        }
      },
      destinationDDDId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ddd',
          key: 'id',
        }
      },
      ratePerMin: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('callingRate');
  }
};
