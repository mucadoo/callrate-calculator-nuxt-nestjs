const CallingRateMapper = require('./SequelizeCallingRateMapper');

class SequelizeCallingRateRepository {
  constructor({ CallingRateModel }) {
    this.CallingRateModel = CallingRateModel;
  }

  async getById(id) {
    const callingRate = await this._getById(id);

    return CallingRateMapper.toEntity(callingRate);
  }

  async _getById(id) {
    try {
      return await this.CallingRateModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `CallingRate with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

}

module.exports = SequelizeCallingRateRepository;
