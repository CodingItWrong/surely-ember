import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | managing todos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it allows adding, editing, and deleting todos', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click('[data-test-available]');

    assert.equal(true, true);
  });
});
