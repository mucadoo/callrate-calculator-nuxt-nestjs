const Operation = require('src/app/Operation');

class GetAllDDDs extends Operation {
  constructor({ dddRepository }) {
    super();
    this.dddRepository = dddRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const ddds = await this.dddRepository.getAll({
        attributes: ['id', 'code']
      });

      this.emit(SUCCESS, ddds);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllDDDs.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllDDDs;
