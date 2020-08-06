import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | todo-list', function (hooks) {
  setupRenderingTest(hooks);

  module('when loading', function () {
    test('it shows a loading indicator', async function (assert) {
      await render(hbs`<TodoList @loading={{true}} />`);

      assert.dom('[data-test-loading-indicator]').exists();
    });
  });
});
