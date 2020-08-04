import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';

module('Integration | Component | app-side-nav-content', function (hooks) {
  setupRenderingTest(hooks);

  module('when authenticated', function () {
    let routerTransitionTo;

    hooks.beforeEach(function () {
      routerTransitionTo = sinon.spy();

      this.owner.register(
        'service:router',
        class RouterStub extends Service {
          transitionTo = routerTransitionTo;
        },
      );

      this.owner.register(
        'service:session',
        class SessionStub extends Service {
          isAuthenticated = true;
        },
      );
    });

    test('it allows navigating to the available route', async function (assert) {
      await render(hbs`<AppSideNavContent />`);

      await click('[data-test-available] button');

      assert.ok(
        routerTransitionTo.calledWith('todos.available'),
        'navigated to available route',
      );
    });
  });
});
