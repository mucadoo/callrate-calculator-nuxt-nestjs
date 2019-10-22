const CallingPlanSerializer = {
  serialize({ id, name, minutes, exceededMinutesPercent }) {
    return {
      id,
      name,
      minutes,
      exceededMinutesPercent
    };
  }
};

module.exports = CallingPlanSerializer;
