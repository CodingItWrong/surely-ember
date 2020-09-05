import { click, render } from '@ember/test-helpers';
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

    it('allows navigating to the available route', async function (assert) {
      await click('[data-test-available] button');

      assert.ok(
        router.transitionTo.calledWith('todos.available'),
        'navigated to available route',
      );
    });

    it('allows navigating to the tomorrow route', async function (assert) {
      await click('[data-test-tomorrow] button');

      assert.ok(
        router.transitionTo.calledWith('todos.tomorrow'),
        'navigated to tomorrow route',
      );
    });

    it('allows navigating to the future route', async function (assert) {
      await click('[data-test-future] button');

      assert.ok(
        router.transitionTo.calledWith('todos.future'),
        'navigated to future route',
      );
    });

    it('allows navigating to the completed route', async function (assert) {
      await click('[data-test-completed] button');

      assert.ok(
        router.transitionTo.calledWith('todos.completed'),
        'navigated to completed route',
      );
    });

    it('allows navigating to the deleted route', async function (assert) {
      await click('[data-test-deleted] button');

      assert.ok(
        router.transitionTo.calledWith('todos.deleted'),
        'navigated to deleted route',
      );
    });
  });
});
