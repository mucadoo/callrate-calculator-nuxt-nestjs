const Operation = require('src/app/Operation');

class GetDDD extends Operation {
  constructor({ dddRepository }) {
    super();
    this.dddRepository = dddRepository;
  }

  async execute(dddId) {
    const { SUCCESS, NOT_FOUND } = this.outputs;

    try {
      const ddd = await this.dddRepository.getById(dddId);
      this.emit(SUCCESS, ddd);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

GetDDD.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetDDD;
