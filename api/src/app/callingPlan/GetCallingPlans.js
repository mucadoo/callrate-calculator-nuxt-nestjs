const Operation = require('src/app/Operation');

class GetCallingPlans extends Operation {
  constructor({ callingPlanRepository }) {
    super();
    this.callingPlanRepository = callingPlanRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const callingPlans = await this.callingPlanRepository.getAll({
        attributes: ['id', 'name', 'minutes', 'exceededMinutesPercent']
      });

      this.emit(SUCCESS, callingPlans);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }

}

GetCallingPlans.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCallingPlans;