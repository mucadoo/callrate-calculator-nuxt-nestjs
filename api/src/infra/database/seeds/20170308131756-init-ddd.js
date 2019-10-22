'use strict';

module.exports = {
  up: function (queryInterface) {
    const ddds = [];
    const defaultDDDs = ["11", "16", "17", "18"];

    for(let i = 0; i < defaultDDDs.length; i++) {
      ddds.push({
        code: defaultDDDs[i],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('ddd', ddds, {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('ddd', null, {});
  }
};
