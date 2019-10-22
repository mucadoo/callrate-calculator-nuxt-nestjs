const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const CallingPlanController = {
  get router() {
    const router = Router();

    router.use(inject('callingPlanSerializer'));

    router.get('/', inject('getCallingPlans'), this.index);
    router.get('/:id', inject('getCallingPlans'), this.show);

    return router;
  },

  index(req, res, next) {
    const { getCallingPlans, callingPlanSerializer } = req;
    const { SUCCESS, ERROR } = getCallingPlans.outputs;

    getCallingPlans
        .on(SUCCESS, (callingPlans) => {
          res
              .status(Status.OK)
              .json(callingPlans.map(callingPlanSerializer.serialize));
        })
        .on(ERROR, next);

    getCallingPlans.execute();
  },

  show(req, res, next) {
    const { getCallingPlan, callingPlanSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getCallingPlan.outputs;

    getCallingPlan
        .on(SUCCESS, (callingPlan) => {
          res
              .status(Status.OK)
              .json(callingPlanSerializer.serialize(callingPlan));
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

    getCallingPlan.execute(Number(req.params.id));
  }

};

module.exports = CallingPlanController;
