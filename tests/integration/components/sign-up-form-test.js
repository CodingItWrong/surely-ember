import { fillIn, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | sign-up-form', function (hooks) {
  setupRenderingTest(hooks);

  describe('validation errors', function (hooks) {
    hooks.beforeEach(async function () {
      await render(hbs`<SignUpForm />`);
    });

    it('requires all fields', async function (assert) {
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

    it('requires password and confirmation to match', async function (assert) {
      await fillIn('[data-test-email-field] input', 'email@example.com');
      await fillIn('[data-test-password-field] input', 'foo');
      await fillIn('[data-test-password-confirmation-field] input', 'bar');
      await triggerEvent('[data-test-sign-up-form]', 'submit');

      assert.dom('[data-test-error-message]').hasText('Passwords do not match');
    });
  });

  describe('error signing up', function (hooks) {
    const email = 'email@example.com';
    const password = 'password';

    hooks.beforeEach(async function () {
      const handleSignUp = () => Promise.reject();
      this.set('handleSignUp', handleSignUp);
      await render(hbs`<SignUpForm @signUp={{handleSignUp}}/>`);

      await fillIn('[data-test-email-field] input', email);
      await fillIn('[data-test-password-field] input', password);
      await fillIn('[data-test-password-confirmation-field] input', password);
      await triggerEvent('[data-test-sign-up-form]', 'submit');
    });

    it('displays the server error', async function (assert) {
      assert
        .dom('[data-test-error-message]')
        .hasText('An error occurred while signing up.');
    });
  });

  describe('sign up success', function (hooks) {
    const email = 'email@example.com';
    const password = 'password';

    let handleSignUp;

    hooks.beforeEach(async function () {
      handleSignUp = sinon.stub().resolves();
      this.set('handleSignUp', handleSignUp);
      await render(hbs`<SignUpForm @signUp={{handleSignUp}}/>`);

      await fillIn('[data-test-email-field] input', email);
      await fillIn('[data-test-password-field] input', password);
      await fillIn('[data-test-password-confirmation-field] input', password);
      await triggerEvent('[data-test-sign-up-form]', 'submit');
    });

    it('passes the credentials to signUp', async function (assert) {
      assert.deepEqual(
        handleSignUp.getCall(0).args,
        [{ email, password }],
        'handleSignup called with credentials',
      );
    });

    it('does not display an error message', async function (assert) {
      assert.dom('[data-test-error-message]').doesNotExist();
    });
  });
});
