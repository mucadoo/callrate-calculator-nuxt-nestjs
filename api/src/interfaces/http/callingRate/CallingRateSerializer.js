const CallingRateSerializer = {
  serialize({ id, originDDDId, destinationDDDId, ratePerMin }) {
    return {
      id,
      originDDDId,
      destinationDDDId,
      ratePerMin
    };
  }
};

module.exports = CallingRateSerializer;
