const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, errorHandler }) => {
  const router = Router();

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware)

  apiRouter.use('/ddd', controller('ddd/DDDController'));
  apiRouter.use('/callingRate', controller('callingRate/CallingRateController'));
  apiRouter.use('/callingPlan', controller('callingPlan/CallingPlanController'));

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
