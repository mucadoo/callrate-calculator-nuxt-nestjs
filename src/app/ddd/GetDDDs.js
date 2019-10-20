const Operation = require('src/app/Operation');

class GetDDDs extends Operation {
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

GetDDDs.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetDDDs;
