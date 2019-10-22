const Operation = require('src/app/Operation');

class GetCallingRateBYDDD extends Operation {
  constructor({ callingRateRepository }) {
    super();
    this.callingRateRepository = callingRateRepository;
  }

  async execute(dddData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    const originDDDId = dddData.originDDDId;
    const destinationDDDId = dddData.destinationDDDId;

    try {
      const callingRate = await this.callingRateRepository.getAll({
        where: {
          originDDDId: originDDDId,
          destinationDDDId: destinationDDDId
        }
      })[0];

      this.emit(SUCCESS, callingRate);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetCallingRateBYDDD.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCallingRateBYDDD;
