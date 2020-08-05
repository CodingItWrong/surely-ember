import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | app-side-nav-content', function (hooks) {
  setupRenderingTest(hooks);

  module('when not authenticated', function (hooks) {
    let session;

    hooks.beforeEach(function () {
      session = { isAuthenticated: false };
      this.owner.register('service:session', session, { instantiate: false });
    });

    test('it does not render', async function (assert) {
      await render(hbs`<AppSideNavContent />`);

      assert.equal(this.element.textContent.trim(), '');
    });
  });

  module('when authenticated', function (hooks) {
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

    test('it allows navigating to the available route', async function (assert) {
      await click('[data-test-available] button');

      assert.ok(
        router.transitionTo.calledWith('todos.available'),
        'navigated to available route',
      );
    });

    test('it allows navigating to the tomorrow route', async function (assert) {
      await click('[data-test-tomorrow] button');

      assert.ok(
        router.transitionTo.calledWith('todos.tomorrow'),
        'navigated to tomorrow route',
      );
    });

    test('it allows navigating to the future route', async function (assert) {
      await click('[data-test-future] button');

      assert.ok(
        router.transitionTo.calledWith('todos.future'),
        'navigated to future route',
      );
    });

    test('it allows navigating to the completed route', async function (assert) {
      await click('[data-test-completed] button');

      assert.ok(
        router.transitionTo.calledWith('todos.completed'),
        'navigated to completed route',
      );
    });

    test('it allows navigating to the deleted route', async function (assert) {
      await click('[data-test-deleted] button');

      assert.ok(
        router.transitionTo.calledWith('todos.deleted'),
        'navigated to deleted route',
      );
    });
  });
});
