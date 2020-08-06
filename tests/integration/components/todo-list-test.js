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

  module('when errored', function () {
    test('it shows an error message', async function (assert) {
      await render(hbs`<TodoList @error={{true}} />`);

      assert
        .dom('[data-test-error-message]')
        .hasText('An error occurred loading todos.');
    });
  });
});
