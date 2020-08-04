import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';

module('Integration | Component | app-side-nav-content', function (hooks) {
  setupRenderingTest(hooks);

  test('it allows navigating to the available route', async function (assert) {
    const routerTransitionTo = sinon.spy();

    class RouterStub extends Service {
      transitionTo = routerTransitionTo;
    }

    class SessionStub extends Service {
      isAuthenticated = true;
    }

    this.owner.register('service:router', RouterStub);
    this.owner.register('service:session', SessionStub);

    await render(hbs`<AppSideNavContent />`);

    await click('[data-test-available] button');

    assert.ok(
      routerTransitionTo.calledWith('todos.available'),
      'navigated to available route',
    );
  });
});
