const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  GetAllDDDs,
  GetDDD
} = require('./app/ddd');

const DDDSerializer = require('./interfaces/http/ddd/DDDSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const logger = require('./infra/logging/logger');
const SequelizeDDDsRepository = require('./infra/ddd/SequelizeDDDsRepository');
const { database, DDD: DDDModel } = require('./infra/database/models');

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
  dddsRepository: asClass(SequelizeDDDsRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  DDDModel: asValue(DDDModel)
});

// Operations
container.register({
  getAllDDDs: asClass(GetAllDDDs),
  getDDD: asClass(GetDDD)
});

// Serializers
container.register({
  dddSerializer: asValue(DDDSerializer)
});

module.exports = container;
