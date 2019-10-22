const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const CallingRateController = {
  get router() {
    const router = Router();

    router.use(inject('callingRateSerializer'));

    router.get('/:id', inject('getCallingRate'), this.show);

    return router;
  },

  index(req, res, next) {
    const { getCallingRates, callingRateSerializer } = req;
    const { SUCCESS, ERROR } = getCallingRates.outputs;

    getDDDs
        .on(SUCCESS, (callingRates) => {
          res
              .status(Status.OK)
              .json(callingRates.map(callingRateSerializer.serialize));
        })
        .on(ERROR, next);

    getDDDs.execute();
  },

  show(req, res, next) {
    const { getCallingRate, callingRateSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getCallingRate.outputs;

    getCallingRate
      .on(SUCCESS, (callingRate) => {
        res
          .status(Status.OK)
          .json(callingRateSerializer.serialize(callingRate));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getCallingRate.execute(Number(req.params.id));
  },

};

module.exports = CallingRateController;
