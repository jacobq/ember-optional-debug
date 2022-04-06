import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import td from 'testdouble';

module('Acceptance | debug present', function (hooks) {
  setupApplicationTest(hooks);

  //test('running with debug dependency', async function (assert) {});

  test('visiting / (sanity check)', async function (assert) {
    await visit('/');
    assert.strictEqual(currentURL(), '/');
  });
});
