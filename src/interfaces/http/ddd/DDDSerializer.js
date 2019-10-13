const DDDSerializer = {
  serialize({ id, code }) {
    return {
      id,
      code
    };
  }
};

module.exports = DDDSerializer;
