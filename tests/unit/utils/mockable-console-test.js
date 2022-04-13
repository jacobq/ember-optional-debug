import mockableConsole from 'dummy/utils/mockable-console';
import { module, test } from 'qunit';

module('Unit | Utility | mockable-console', function () {
  test('it has log and warn functions', function (assert) {
    assert.strictEqual(typeof mockableConsole, 'object');
    assert.strictEqual(typeof mockableConsole.log, 'function');
    assert.strictEqual(typeof mockableConsole.warn, 'function');
  });
});
