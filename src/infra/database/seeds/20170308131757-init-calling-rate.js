'use strict';

module.exports = {
  up: function (queryInterface) {
    const callingRates = [];
    const defaultCallingRates = [
      [1, 2, 1.9],
      [2, 1, 2.9],
      [1, 2, 1.7],
      [3, 1, 2.7],
      [1, 4, 0.9],
      [4, 1, 1.9]
    ];

    for (let i = 0; i < defaultCallingRates.length; i++) {
      callingRates.push({
        originDDDId: defaultCallingRates[i][0],
        destinationDDDId: defaultCallingRates[i][1],
        ratePerMin: defaultCallingRates[i][2],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('callingRate', callingRates, {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('callingRate', null, {});
  }
};
