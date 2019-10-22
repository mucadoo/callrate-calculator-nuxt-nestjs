const DDD = require('src/domain/ddd/DDD');

const SequelizeDDDMapper = {
  toEntity({ dataValues }) {
    const { id, code } = dataValues;

    return new DDD({ id, code });
  },

  toDatabase(survivor) {
    const { code } = survivor;

    return { code };
  }
};

module.exports = SequelizeDDDMapper;
