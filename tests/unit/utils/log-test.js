import { getLoggingFunctions } from 'ember-optional-debug/utils/log';
import { module, test } from 'qunit';
import { only } from 'qunit';
//import debug from 'debug';
import * as td from 'testdouble';

module('Unit | Utility | log', function (hooks) {
  let cLog, cWarn, debug;
  hooks.beforeEach(function () {
    cLog = td.replace(console, 'log');
    cWarn = td.replace(console, 'warn');
    debug = td.replace('debug');
  });
  hooks.afterEach(function () {
    td.reset();
  });

  test('it exports getLoggingFunctions', function (assert) {
    assert.strictEqual(typeof getLoggingFunctions, 'function');
  });

  test('it throws when invalid config option passed', function (assert) {
    assert.expect(2);
    const badOptions = {
      logProvider: 'not one of the actual choices',
    };
    let exception;
    try {
      getLoggingFunctions('throw-me', badOptions);
      assert.fail('Execution should not have reached this point');
    } catch (e) {
      exception = e;
    } finally {
      assert.ok(exception instanceof Error, `Caught exception (${exception})`);
      assert.ok(
        exception.message.includes('logProvider'),
        `Exception related to bad logProvider option`
      );
    }
  });

  test('it can log/warn through console', async function (assert) {
    const { log, warn } = getLoggingFunctions('my-namespace:foo');
    log('testing testing', 123);
    assert.verify(cLog('my-namespace:foo', 'testing testing', 123));

    const e = Error('This error is only for testing purposes');
    warn(e);
    assert.verify(cWarn('my-namespace:foo', e));
  });

  only('it can log/warn through debug', async function (assert) {
    //const stub = td.function();
    //const debugMock =
    //await td.replaceEsm('debug', {
    //  default(namespace) {
    //    return function (...args) {
    //      stub(namespace, ...args);
    //      //console.log(`MOCKED ${namespace}`, ...args);
    //    };
    //  },
    //});
    const { log } = getLoggingFunctions('foo:debug', { logProvider: 'debug' });
    log('send this to debug', 123);
    assert.verify(cLog('my-namespace:foo', 'testing testing', 123));
    console.log(cWarn); // DUMMY
  });

});
