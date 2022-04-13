import { getLoggingFunctions } from 'ember-optional-debug/utils/log';
import { module, test } from 'qunit';
import * as td from 'testdouble';

module('Unit | Utility | log', function (hooks) {
  let cLog, cWarn;
  hooks.beforeEach(function () {
    cLog = td.replace(console, 'log');
    cWarn = td.replace(console, 'warn');
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
      logProvider: 'unsupported-option',
    };
    let exception;
    try {
      //const { log, logVerbose, warn } = getLoggingFunctions('throw-me', badOptions);
      //log('This should never run');
      //logVerbose('This should never run');
      //warn('This should never run');
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

  test('it can log through console', async function (assert) {
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
    const { log } = getLoggingFunctions('my-namespace:foo');
    log('testing testing', 123);
    assert.verify(cLog('my-namespace:foo', 'testing Xtesting', 123));
    console.log(cWarn); // DUMMY
  });
});
