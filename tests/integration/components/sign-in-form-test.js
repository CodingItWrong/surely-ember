import { render, fillIn, triggerEvent, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | sign-in-form', function (hooks) {
  setupRenderingTest(hooks);

  const email = 'email@example.com';
  const password = 'password';

  module('sign in success', function (hooks) {
    let session;
    let onSignedIn;

    hooks.beforeEach(async function () {
      session = {
        authenticate: sinon.stub().resolves(),
      };
      onSignedIn = sinon.spy();

      this.owner.register('service:session', session, { instantiate: false });
      this.set('onSignedIn', onSignedIn);
      await render(hbs`<SignInForm @onSignedIn={{onSignedIn}} />`);

      await fillIn('[data-test-email-field] input', email);
      await fillIn('[data-test-password-field] input', password);
      await triggerEvent('[data-test-sign-in-form]', 'submit');
    });

    test('it calls authenticate with credentials', function (assert) {
      assert.deepEqual(
        session.authenticate.getCall(0).args,
        ['authenticator:oauth', email, password],
        'authenticate called with credentials',
      );
    });

    test('it calls onSignedIn', function (assert) {
      assert.ok(onSignedIn.calledOnce, 'onSignedIn called');
    });
  });

  module('sign in failure', function (hooks) {
    const errorMessage = 'Server error';

    let session;
    let onSignedIn;

    hooks.beforeEach(async function () {
      session = {
        authenticate: sinon.stub().rejects(new Error(errorMessage)),
      };
      onSignedIn = sinon.spy();

      this.owner.register('service:session', session, { instantiate: false });
      this.set('onSignedIn', onSignedIn);
      await render(hbs`<SignInForm @onSignedIn={{onSignedIn}} />`);

      await fillIn('[data-test-email-field] input', email);
      await fillIn('[data-test-password-field] input', password);
      await triggerEvent('[data-test-sign-in-form]', 'submit');
    });

    test('it displays an error message', function (assert) {
      assert.dom('[data-test-error-message]').hasText(errorMessage);
    });

    test('it does not call onSignedIn', function (assert) {
      assert.ok(onSignedIn.notCalled, 'onSignedIn not called');
    });
  });

  module('clicking sign up', function () {
    test('navigates to the sign up route', async function (assert) {
      const router = {
        transitionTo: sinon.spy(),
      };

      this.owner.register('service:router', router, { instantiate: false });
      await render(hbs`<SignInForm />`);

      await click('[data-test-sign-up-button]');

      assert.ok(
        router.transitionTo.calledWith('user.new'),
        'transitioned to sign up route',
      );
    });
  });
});
