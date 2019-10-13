const CallingRate = require('src/domain/callingRate/CallingRate');

const SequelizeCallingRateMapper = {
  toEntity({ dataValues }) {
    const { id, originDDDId, destinationDDDId, ratePerMin } = dataValues;

    return new CallingRate({ id, originDDDId, destinationDDDId, ratePerMin });
  },

  toDatabase(survivor) {
    const { originDDDId, destinationDDDId, ratePerMin } = survivor;

    return { originDDDId, destinationDDDId, ratePerMin };
  }
};

module.exports = SequelizeCallingRateMapper;
