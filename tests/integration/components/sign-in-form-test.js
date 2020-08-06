import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | sign-in-form', function (hooks) {
  setupRenderingTest(hooks);

  module('sign in success', function (hooks) {
    const email = 'email@example.com';
    const password = 'password';

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
});
