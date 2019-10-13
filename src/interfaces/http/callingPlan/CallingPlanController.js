const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const CallingPlanController = {
  get router() {
    const router = Router();

    router.use(inject('callingPlanSerializer'));

    router.get('/:id', inject('getCallingPlan'), this.show);

    return router;
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
  },

};

module.exports = CallingPlanController;
