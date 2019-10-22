const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  GetDDD,
  GetDDDs
} = require('./app/ddd');
const {
  GetCallingPlan,
  GetCallingPlans
} = require('./app/callingPlan');
const {
  GetCallingRate,
  GetCallingRates,
  GetCallingRateBYDDD
} = require('./app/callingRate');

const DDDSerializer = require('./interfaces/http/ddd/DDDSerializer');
const CallingPlanSerializer = require('./interfaces/http/callingPlan/CallingPlanSerializer');
const CallingRateSerializer = require('./interfaces/http/callingRate/CallingRateSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const errorHandler = require('./interfaces/http/errors/errorHandler');

const SequelizeDDDRepository = require('./infra/ddd/SequelizeDDDRepository');
const SequelizeCallingPlanRepository = require('./infra/callingPlan/SequelizeCallingPlanRepository');
const SequelizeCallingRateRepository = require('./infra/callingRate/SequelizeCallingRateRepository');
const { database, DDD: DDDModel, CallingRate: CallingRateModel, CallingPlan: CallingPlanModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(errorHandler),
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
  getDDD: asClass(GetDDD),
  getDDDs: asClass(GetDDDs),
  getCallingPlan: asClass(GetCallingPlan),
  getCallingPlans: asClass(GetCallingPlans),
  getCallingRate: asClass(GetCallingRate),
  getCallingRates: asClass(GetCallingRates),
  getCallingRateBYDDD: asClass(GetCallingRateBYDDD)
});

// Serializers
container.register({
  dddSerializer: asValue(DDDSerializer),
  callingPlanSerializer: asValue(CallingPlanSerializer),
  callingRateSerializer: asValue(CallingRateSerializer)
});

module.exports = container;
