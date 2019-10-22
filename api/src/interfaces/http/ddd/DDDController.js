const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const DDDController = {
  get router() {
    const router = Router();

    router.use(inject('dddSerializer'));

    router.get('/', inject('getDDDs'), this.index);

    return router;
  },

  index(req, res, next) {
    const { getDDDs, dddSerializer } = req;
    const { SUCCESS, ERROR } = getDDDs.outputs;

    getDDDs
      .on(SUCCESS, (ddds) => {
        res
          .status(Status.OK)
          .json(ddds.map(dddSerializer.serialize));
      })
      .on(ERROR, next);

    getDDDs.execute();
  }

};

module.exports = DDDController;
