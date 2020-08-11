import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | sign up', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('creating a new account', async function (assert) {
    await visit('/');

    await click('[data-test-sign-up-button]');
    await fillIn('[data-test-email-field] input', 'example@example.com');
    const password = 'password';
    await fillIn('[data-test-password-field] input', password);
    await fillIn('[data-test-password-confirmation-field] input', password);
    await click('[data-test-sign-up-confirm-button]');

    assert.equal(currentURL(), '/todos/available');
    assert.dom('[data-test-new-todo-field]').exists();
  });
});
