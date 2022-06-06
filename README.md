# Base
![npm version](https://img.shields.io/npm/v/@plgworks/base.svg?style=flat)

Base provides frequently used functionality like cutome logger, response helper, Custom Promise and Instance composer. 
These are used in almost all PLG Works repositories and hence the name `Base`.

## Installation
```shell script
npm install @plgworks/base --save
```

## Logger
Logging is a basic functionality which is needed in all the applications. Custom logger helps in standardizing the logging 
and thus help in debugging and analysis. To log different levels of information, we use different colors, which can be 
visually distinguished easily.

In the following snippet, we try to showcase all the logger methods with documentation in comments.

```js
const Base = require('@plgworks/base');
const Logger  = Base.Logger;

// Constructor's first parameter is the module name. This is logged in every line to separate logs from multiple modules.
// Constructor's second parameter is the log level. Depending on log level, some methods will work and others will not do anything.
const logger  = new Logger("<module name>", Logger.LOG_LEVELS.TRACE);

//Log Level FATAL 
logger.notify("notify called");

//Log Level ERROR
logger.error("error called");

//Log Level WARN
logger.warn("warn called");

//Log Level INFO
logger.info("info Invoked");
logger.step("step Invoked");
logger.win("win called");

//Log Level DEBUG
logger.log("log called");
logger.debug("debug called");
logger.dir({ l1: { l2 : { l3Val: "val3", l3: { l4Val: { val: "val"  }}} }});

//Log Level TRACE
logger.trace("trace called");
```

All methods will be available for use irrespective of configured log level.
Log Level only controls what needs to be logged.

### Method to Log Level Map
| Method | Enabling  |
|        | Log Level |
| :----- | :-------- |
| notify | FATAL     |
| error  | ERROR     |
| warn   | WARN      |
| info   | INFO      |
| step   | INFO      |
| win    | INFO      |
| debug  | DEBUG     |
| log    | DEBUG     |
| dir    | DEBUG     |
| trace  | TRACE     |

## Response formatter
Response formatter helps to maintain standard format of the response given out by various libraries and services.

```js
// rootPrefix is the path to the root of this package. Give proper path if installed inside node_modules
const rootPrefix = '.';

// paramErrorConfig is an object with error identifiers as key and value is an object with keys parameter and message.
// parameter is the name of the parameter which had error, for example invalid value, missing value, etc.
const paramErrorConfig = require(rootPrefix + '/tests/mocha/lib/formatter/paramErrorConfig');

// apiErrorConfig is an object with error identifiers as key and value is an object with keys http_code, code and message.
// http_code goes as the api http code while rendering.
// message and code goes in the error object.
const apiErrorConfig = require(rootPrefix + '/tests/mocha/lib/formatter/apiErrorConfig');

const Base = require('@plgworks/base');
const ResponseHelper  = Base.responseHelper;

// Creating an object of ResponseHelper. Parameter is an object with key moduleName.
const responseHelper = new ResponseHelper({
      moduleName: '<module name>'
  });
    
// for sending an error which is not parameter specific, following function can be used.
// internal_error_identifier is used for debugging.
// api_error_identifier is used to fetch information from the apiErrorConfig
const r1 = responseHelper.error({
  internal_error_identifier: 's_vt_1', 
  api_error_identifier: 'test_1',
  debug_options: {id: 1234},
  error_config: {
    param_error_config: paramErrorConfig,
    api_error_config: apiErrorConfig   
  }
});

// r1.toHash() gives following:
// {
//   success: false,
//   err: {
//     code: 'invalid_request',
//     msg: 'At least one parameter is invalid or missing. See err.error_data for more details.',
//     error_data: [],
//     internal_id: 's_vt_1'
//   }
// }
    
// For sending parameter specific errors, following function can be used.
// internal_error_identifier is used for debugging.
// api_error_identifier is used to fetch information from the apiErrorConfig
// params_error_identifiers is array of string, which are keys of paramErrorConfig
const r2 = responseHelper.paramValidationError({
  internal_error_identifier:"s_vt_2", 
  api_error_identifier: "test_1", // key of apiErrorConfig
  params_error_identifiers: ["test_1"], // keys of paramErrorConfig
  debug_options: {id: 1234},
  error_config: {
    param_error_config: paramErrorConfig,
    api_error_config: apiErrorConfig   
  }
});

// r2.toHash() gives following:
// {
//   success: false,
//   err: {
//     code: 'invalid_request',
//     msg: 'At least one parameter is invalid or missing. See err.error_data for more details.',
//     error_data: [  { parameter: 'Username', msg: 'Invalid' } ],
//     internal_id: 's_vt_2'
//   }
// }

// To check if the Result object is a success or not isSuccess function can be used. It returns a boolean.
// For example:
r1.isSuccess(); // this will be false.

// isFailure function return NOT of that returned by isSuccess function.
// For example:
r1.isFailure(); // this will be true.

// To convert to a format which can be exposed over API, toHash function can be used.
r1.toHash(); // Examples given above.
```

## CustomPromise QueueManager
QueueManager provides various management options and configurations for a queue of Promises. Following is a brief 
documentation of the various manager options and example usage.
```js
const Base = require('@plgworks/base'),
  logger  = new Base.Logger("my_module_name");

const queueManagerOptions = {
  // Specify the name for easy identification in logs.
  name: "my_module_name_promise_queue"

  // resolvePromiseOnTimeout :: set this flag to false if you need custom handling.
  // By Default, the manager will neither resolve nor reject the Promise on time out.
  , resolvePromiseOnTimeout: false
  // The value to be passed to resolve when the Promise has timedout.
  , resolvedValueOnTimeout: null

  // rejectPromiseOnTimeout :: set this flag to true if you need custom handling.
  , rejectPromiseOnTimeout : false

  //  Pass timeoutInMilliSecs in options to set the timeout.
  //  If less than or equal to zero, timeout will not be observed.
  , timeoutInMilliSecs: 5000

  //  Pass maxZombieCount in options to set the max acceptable zombie count.
  //  When this zombie promise count reaches this limit, onMaxZombieCountReached will be triggered.
  //  If less than or equal to zero, onMaxZombieCountReached callback will not triggered.
  , maxZombieCount: 0

  //  Pass logInfoTimeInterval in options to log queue healthcheck information.
  //  If less than or equal to zero, healthcheck will not be logged.
  , logInfoTimeInterval : 0


  , onPromiseResolved: function ( resolvedValue, promiseContext ) {
    //onPromiseResolved will be executed when the any promise is resolved.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    const oThis = this;

    logger.log(oThis.name, " :: a promise has been resolved. resolvedValue:", resolvedValue);
  }

  , onPromiseRejected: function ( rejectReason, promiseContext ) {
    //onPromiseRejected will be executed when the any promise is timedout.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    const oThis = this;

    logger.log(oThis.name, " :: a promise has been rejected. rejectReason: ", rejectReason);
  }

  , onPromiseTimedout: function ( promiseContext ) {
    //onPromiseTimedout will be executed when the any promise is timedout.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    const oThis = this;

    logger.log(oThis.name, ":: a promise has timed out.", promiseContext.executorParams);
  }

  , onMaxZombieCountReached: function () {
    //onMaxZombieCountReached will be executed when maxZombieCount >= 0 && current zombie count (oThis.zombieCount) >= maxZombieCount.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    const oThis = this;

    logger.log(oThis.name, ":: maxZombieCount reached.");

  }

  , onPromiseCompleted: function ( promiseContext ) {
    //onPromiseCompleted will be executed when the any promise is removed from pendingPromise queue.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    const oThis = this;

    logger.log(oThis.name, ":: a promise has been completed.");
  }  
  , onAllPromisesCompleted: function () {
    //onAllPromisesCompleted will be executed when the last promise in pendingPromise is resolved/rejected.
    //This callback method should be set by instance creator.
    //It can be set using options parameter in constructor.
    //Ideally, you should set this inside SIGINT/SIGTERM handlers.

    logger.log("Examples.allResolve :: onAllPromisesCompleted triggered");
    manager.logInfo();
  }
};


const promiseExecutor = function ( resolve, reject, params, promiseContext ) {
  //promiseExecutor
  setTimeout(function () {
    resolve( params.cnt ); // Try different things here.
  }, 1000);
};

const manager = new Base.CustomPromise.QueueManager( promiseExecutor, queueManagerOptions);

// createPromise calls the promiseExecutor
for( let cnt = 0; cnt < 5; cnt++ ) {
  manager.createPromise( {"cnt": (cnt + 1) } );
}
```

# Running test cases
```shell script
./node_modules/.bin/mocha --recursive "./tests/**/*.js"
```
