const CallingPlan = require('src/domain/callingPlan/CallingPlan');

const SequelizeCallingPlanMapper = {
  toEntity({ dataValues }) {
    const { id, name, minutes, exceededMinutesPercent } = dataValues;

    return new CallingPlan({ id, name, minutes, exceededMinutesPercent });
  },

  toDatabase(survivor) {
    const { code } = survivor;

    return { code };
  }
};

module.exports = SequelizeCallingPlanMapper;
