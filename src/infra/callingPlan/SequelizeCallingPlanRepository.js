const CallingPlanMapper = require('./SequelizeCallingPlanMapper');

class SequelizeCallingPlanRepository {
  constructor({ CallingPlanModel }) {
    this.CallingPlanModel = CallingPlanModel;
  }

  async getAll(...args) {
    const callingPlans = await this.CallingPlanModel.findAll(...args);

    return callingPlans.map(CallingPlanMapper.toEntity);
  }

  async getById(id) {
    const callingPlan = await this._getById(id);

    return CallingPlanMapper.toEntity(callingPlan);
  }

  async _getById(id) {
    try {
      return await this.CallingPlanModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `CallingPlan with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

}

module.exports = SequelizeCallingPlanRepository;
