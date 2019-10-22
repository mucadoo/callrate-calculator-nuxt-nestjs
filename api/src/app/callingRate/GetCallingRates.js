const Operation = require('src/app/Operation');

class GetCallingRates extends Operation {
  constructor({ callingRateRepository }) {
    super();
    this.callingRateRepository = callingRateRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const callingRates = await this.callingRateRepository.getAll({
        attributes: ['id', 'originDDDId', 'destinationDDDId', 'ratePerMin']
      });

      this.emit(SUCCESS, callingRates);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }

}

GetCallingRates.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetCallingRates;