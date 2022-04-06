import { getLoggingFunctions } from 'ember-optional-debug/utils/log';
import { hooks, module, test } from 'qunit';
import * as td from 'testdouble';

module('Unit | Utility | log', function () {
  hooks.beforeEach(function () {

  });
  hooks.afterEach(function () {
    td.reset();
  });

  test('it exports getLoggingFunctions', function (assert) {
    assert.strictEqual(typeof getLoggingFunctions, 'function');
  });

  test('it does not throw when debug module is missing', async function (assert) {
    const stub = td.function();
    //const debugMock =
    await td.replaceEsm('debug', {
      default(namespace) {
        return function (...args) {
          stub(namespace, ...args);
          //console.log(`MOCKED ${namespace}`, ...args);
        };
      },
    });
    const { log } = getLoggingFunctions('my-namespace:foo');
    log('testing testing', 123);
    assert.verify(stub('my-namespace:foo', 'testing testing', 123));
  });
});
