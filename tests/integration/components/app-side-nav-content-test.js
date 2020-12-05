import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | app-side-nav-content', function (hooks) {
  setupRenderingTest(hooks);

  describe('when not authenticated', function (hooks) {
    let session;

    hooks.beforeEach(function () {
      session = { isAuthenticated: false };
      this.owner.register('service:session', session, { instantiate: false });
    });

    it('does not render', async function (assert) {
      await render(hbs`<AppSideNavContent />`);

      assert.equal(this.element.textContent.trim(), '');
    });
  });

  describe('when authenticated', function (hooks) {
    let session;
    let router;

    hooks.beforeEach(async function () {
      session = { isAuthenticated: true };
      router = {
        transitionTo: sinon.spy(),
      };

      this.owner.register('service:session', session, { instantiate: false });
      this.owner.register('service:router', router, { instantiate: false });

      await render(hbs`<AppSideNavContent />`);
    });

    it('renders', async function (assert) {
      await render(hbs`<AppSideNavContent />`);

      assert.notEqual(this.element.textContent.trim(), '');
    });
  });
});
