'use strict';

module.exports = {
  up: function (queryInterface) {
    const callingPlans = [];
    const defaultCallingPlans = [
      ['FaleMais 30', 30, 10],
      ['FaleMais 60', 60, 10],
      ['FaleMais 120', 120, 10]
    ];

    for (let i = 0; i < defaultCallingPlans.length; i++) {
      callingPlans.push({
        name: defaultCallingPlans[i][0],
        minutes: defaultCallingPlans[i][1],
        exceededMinutesPercent: defaultCallingPlans[i][2],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('callingPlan', callingPlans, {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('callingPlan', null, {});
  }
};
