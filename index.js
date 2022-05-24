/**
 * Index File for @plgworks/base
 */

const rootPrefix = '.',
  Logger = require(rootPrefix + '/lib/logger/CustomConsoleLogger'),
  PromiseContext = require(rootPrefix + '/lib/promiseContext/PromiseContext'),
  PCQueueManager = require(rootPrefix + '/lib/promiseContext/PromiseQueueManager'),
  InstanceComposer = require(rootPrefix + '/lib/InstanceComposer'),
  ResponseHelper = require(rootPrefix + '/lib/formatter/ResponseHelper');

// Expose all libs here.
// All classes should begin with Capital letter.
// All instances/objects should begin with small letter.
module.exports = {
  logger: new Logger(),
  Logger: Logger,
  CustomPromise: {
    Context: PromiseContext,
    QueueManager: PCQueueManager
  },
  responseHelper: ResponseHelper,
  InstanceComposer: InstanceComposer
};

/*
  Base = require("./index");

  //Test Logger
  logger = new Base.Logger("Test");
  logger.testLogger()

  //Test PromiseQueueManager
  PQM = Base.CustomPromise.QueueManager;

  //Run these one by one.
  PQM.Examples.allReject();

  PQM.Examples.allResolve();
  PQM.Examples.allReject();
  PQM.Examples.allTimeout();
  PQM.Examples.executorWithParams();
  PQM.Examples.maxZombieCount();
*/
