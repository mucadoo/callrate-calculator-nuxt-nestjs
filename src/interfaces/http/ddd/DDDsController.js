const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const DDDsController = {
  get router() {
    const router = Router();

    router.use(inject('dddSerializer'));

    router.get('/', inject('getAllDDDs'), this.index);
    router.get('/:id', inject('getDDD'), this.show);

    return router;
  },

  index(req, res, next) {
    const { getAllDDDs, dddSerializer } = req;
    const { SUCCESS, ERROR } = getAllDDDs.outputs;

    getAllDDDs
      .on(SUCCESS, (ddds) => {
        res
          .status(Status.OK)
          .json(ddds.map(dddSerializer.serialize));
      })
      .on(ERROR, next);

    getAllDDDs.execute();
  },

  show(req, res, next) {
    const { getDDD, dddSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getDDD.outputs;

    getDDD
      .on(SUCCESS, (ddd) => {
        res
          .status(Status.OK)
          .json(dddSerializer.serialize(ddd));
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getDDD.execute(Number(req.params.id));
  },

};

module.exports = DDDsController;
