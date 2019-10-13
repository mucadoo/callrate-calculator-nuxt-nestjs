const DDDMapper = require('./SequelizeDDDMapper');

class SequelizeDDDRepository {
  constructor({ DDDModel }) {
    this.DDDModel = DDDModel;
  }

  async getAll(...args) {
    const ddds = await this.DDDModel.findAll(...args);

    return ddds.map(DDDMapper.toEntity);
  }

  async getById(id) {
    const ddd = await this._getById(id);

    return DDDMapper.toEntity(ddd);
  }

  async _getById(id) {
    try {
      return await this.DDDModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `DDD with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

}

module.exports = SequelizeDDDRepository;
