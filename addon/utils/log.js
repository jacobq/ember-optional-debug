import mConsole from 'ember-optional-debug/utils/mockable-console';
import config from 'ember-get-config';
// too bad we can't just import debug like this and still allow it to be optional :'(
//import debug from 'debug';

const defaultOptions = {
  logProvider: 'debug',
};

export function getLoggingFunctions(logNamespace, configOverride) {
  const debugConfig = configOverride
    ? configOverride
    : config?.['ember-optional-debug'] || defaultOptions;
  const { logProvider } = debugConfig;
  switch (logProvider) {
    default:
      throw Error(`Unrecognized logProvider option: ${logProvider}`);
    case 'none':
      return getNoOpLoggingFunctions();
    case 'console':
      return getConsoleLoggingFunctions(logNamespace);
    case 'debug':
      return getDebugLoggingFunctions(logNamespace);
  }
}

function getNoOpLoggingFunctions() {
  const noOp = (...args) => undefined; // eslint-disable-line no-unused-vars
  return {
    log: noOp,
    logVerbose: noOp,
    warn: noOp,
  };
}

function getConsoleLoggingFunctions(logNamespace) {
  return {
    log(...args) {
      return mConsole.log(logNamespace, ...args);
    },
    logVerbose(...args) {
      return mConsole.log(`${logNamespace}:verbose`, ...args);
    },
    warn(...args) {
      return mConsole.warn(logNamespace, ...args);
    },
  };
}

// This queue is used to store data from calls that should go to debug while debug is being loaded
const queue = []; // entry => [Date.now(), 'log'|'logVerbose'|'warn', namespace, args]

let didFailToLoadDebug = false;
let debug = null;
try {
  import('debug')
    .then((mod) => {
      debug = mod.default;
      // Now that we have loaded the debug library we can flush out the queued messages
      const loggers = {};
      for (const item of queue) {
        const [time, type, namespace, args] = item;
        let logger = loggers[namespace]?.[type];
        if (!logger) {
          logger =
            type === 'logVerbose'
              ? debug(`${namespace}:verbose`)
              : debug(namespace);
          if (type === 'warn') {
            logger.log = mConsole.warn.bind(mConsole);
          }
          loggers[namespace] = loggers[namespace] || {};
          loggers[namespace][type] = logger;
        }
        logger(`[${time}]`, ...args);
      }
      queue.length = 0;
    })
    .catch(() => {
      didFailToLoadDebug = true;
    });
} catch {
  didFailToLoadDebug = true;
}

function getDebugLoggingFunctions(logNamespace) {
  if (didFailToLoadDebug) {
    // fall back to console methods if debug library is missing
    return getConsoleLoggingFunctions(logNamespace);
  }
  if (debug) {
    return debugFunctions(logNamespace);
  }
  return getQueuedDebugLoggingFunctions(logNamespace);
}

function debugFunctions(logNamespace) {
  const functions = {
    log: debug(logNamespace),
    logVerbose: debug(`${logNamespace}:verbose`),
    warn: debug(logNamespace),
  };
  functions.warn.log = mConsole.warn.bind(mConsole);
  return functions;
}

function getQueuedDebugLoggingFunctions(logNamespace) {
  function queueIfNotReady(type, namespace) {
    return function (...args) {
      if (!debug) {
        queue.push([Date.now(), type, namespace, args]);
      } else {
        const { log, logVerbose, warn } = debugFunctions(log);
        switch (type) {
          case 'log':
            log(...args);
            break;
          case 'logVerbose':
            logVerbose(...args);
            break;
          case 'warn':
            warn(...args);
            break;
        }
      }
    };
  }

  return {
    log: queueIfNotReady('log', logNamespace),
    logVerbose: queueIfNotReady('logVerbose', logNamespace),
    warn: queueIfNotReady('warn', logNamespace),
  };
}
