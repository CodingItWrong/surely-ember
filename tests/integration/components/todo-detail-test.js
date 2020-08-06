import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import set from 'date-fns/set';
import addDays from 'date-fns/addDays';

module('Integration | Component | todo-detail', function (hooks) {
  setupRenderingTest(hooks);

  module('error loading', function () {
    test('it displays an error message', async function (assert) {
      await render(hbs`<TodoDetail @error={{true}} />`);
      assert.dom('[data-test-error-message]').hasText('Error loading todo');
    });
  });

  module('available todo', function (hooks) {
    test('it displays todo info', async function (assert) {
      const now = new Date();
      const createdAt = set(now, { hours: 1, minutes: 23, seconds: 0 });
      const deferredUntil = addDays(now, -1);
      const todo = {
        id: 1,
        name: 'My Todo',
        notes: 'Todo notes.',
        createdAt,
        deferredUntil,
      };

      this.set('todo', todo);
      await render(hbs`<TodoDetail @todo={{todo}} />`);

      assert.dom('[data-test-todo-name]').hasText(todo.name);
      assert.dom('[data-test-todo-notes]').hasText(todo.notes);
      assert
        .dom('[data-test-deferred-until]')
        .hasText('Deferred until yesterday');
      assert.dom('[data-test-created-at]').hasText('Created today at 1:23 AM');
    });
  });
});
