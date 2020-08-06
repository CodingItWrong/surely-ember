import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent, pauseTest } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | sign-up-form', function (hooks) {
  setupRenderingTest(hooks);

  module('validation errors', function (hooks) {
    hooks.beforeEach(async function () {
      await render(hbs`<SignUpForm />`);
    });

    test('it requires all fields', async function (assert) {
      await triggerEvent('[data-test-sign-up-form]', 'submit');

      assert
        .dom('[data-test-email-field] .paper-input-error')
        .hasText('This is required.');
      assert
        .dom('[data-test-password-field] .paper-input-error')
        .hasText('This is required.');
      assert
        .dom('[data-test-password-confirmation-field] .paper-input-error')
        .hasText('This is required.');
    });

    test('it requires password and confirmation to match', async function (assert) {
      await fillIn('[data-test-email-field] input', 'email@example.com');
      await fillIn('[data-test-password-field] input', 'foo');
      await fillIn('[data-test-password-confirmation-field] input', 'bar');
      await triggerEvent('[data-test-sign-up-form]', 'submit');

      assert.dom('[data-test-error-message]').hasText('Passwords do not match');
    });
  });
});
