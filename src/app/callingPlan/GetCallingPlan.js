const Operation = require('src/app/Operation');

class GetCallingPlan extends Operation {
  constructor({ callingPlanRepository }) {
    super();
    this.callingPlanRepository = callingPlanRepository;
  }

  async execute(callingPlanId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const user = await this.callingPlanRepository.getById(callingPlanId);
      this.emit(SUCCESS, user);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetCallingPlan.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCallingPlan;
