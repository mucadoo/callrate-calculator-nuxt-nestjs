const Operation = require('src/app/Operation');

class GetCallingRate extends Operation {
  constructor({ callingRateRepository }) {
    super();
    this.callingRateRepository = callingRateRepository;
  }

  async execute(callingRateId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const user = await this.callingRateRepository.getById(callingRateId);
      this.emit(SUCCESS, user);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetCallingRate.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCallingRate;
