const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const CallingRateController = {
  get router() {
    const router = Router();

    router.use(inject('callingRateSerializer'));

    router.get('/', inject('getCallingRates'), this.index);
    router.get('/:id', inject('getCallingRate'), this.show);
    //router.post('/getRate', inject('getRate'), this.showByDDD());

    return router;
  },

  index(req, res, next) {
    const { getCallingRates, callingRateSerializer } = req;
    const { SUCCESS, ERROR } = getCallingRates.outputs;

    getCallingRates
        .on(SUCCESS, (callingRates) => {
          res
              .status(Status.OK)
              .json(callingRates.map(callingRateSerializer.serialize));
        })
        .on(ERROR, next);

    getCallingRates.execute();
  },

  show(req, res, next) {
    const { getCallingRate, callingRateSerializer } = req;

    console.log(req);

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

  showByDDD(req, res, next) {
    const { getRate, callingRateSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = getRate.outputs;

    getRate
        .on(SUCCESS, (callingRate) => {
          res
              .status(Status.OK)
              .json(callingRateSerializer.serialize(callingRate));
        })
        .on(VALIDATION_ERROR, (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: 'ValidationError',
            details: error.details
          });
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

    getRate.execute(req.body);
  }

};

module.exports = CallingRateController;
