const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  GetAllDDDs,
  GetDDD
} = require('./app/ddd');
const {
  GetCallingPlan
} = require('./app/callingPlan');
const {
  GetCallingRate
} = require('./app/callingRate');

const DDDSerializer = require('./interfaces/http/ddd/DDDSerializer');
const CallingPlanSerializer = require('./interfaces/http/callingPlan/CallingPlanSerializer');
const CallingRateSerializer = require('./interfaces/http/callingRate/CallingRateSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const logger = require('./infra/logging/logger');
const SequelizeDDDRepository = require('./infra/ddd/SequelizeDDDRepository');
const SequelizeCallingPlanRepository = require('./infra/callingPlan/SequelizeCallingPlanRepository');
const SequelizeCallingRateRepository = require('./infra/callingRate/SequelizeCallingRateRepository');
const { database, DDD: DDDModel, CallingPlan: CallingPlanModel, CallingRate: CallingRateModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware])
  });

// Repositories
container.register({
  dddRepository: asClass(SequelizeDDDRepository).singleton(),
  callingPlanRepository: asClass(SequelizeCallingPlanRepository).singleton(),
  callingRateRepository: asClass(SequelizeCallingRateRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  DDDModel: asValue(DDDModel),
  CallingPlanModel: asValue(CallingPlanModel),
  CallingRateModel: asValue(CallingRateModel)
});

// Operations
container.register({
  getAllDDDs: asClass(GetAllDDDs),
  getDDD: asClass(GetDDD),
  getCallingPlan: asClass(GetCallingPlan),
  getCallingRate: asClass(GetCallingRate)
});

// Serializers
container.register({
  dddSerializer: asValue(DDDSerializer),
  callingPlanSerializer: asValue(CallingPlanSerializer),
  callingRateSerializer: asValue(CallingRateSerializer)
});

module.exports = container;
