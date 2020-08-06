import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

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

  module('individual todos', function (hooks) {
    const todos = [
      { id: 1, name: 'Todo 1' },
      { id: 2, name: 'Todo 2' },
    ];

    let handleChooseTodo;

    hooks.beforeEach(async function () {
      handleChooseTodo = sinon.spy();

      this.set('todos', todos);
      this.set('handleChooseTodo', handleChooseTodo);
      await render(
        hbs`<TodoList @todos={{todos}} @onChooseTodo={{handleChooseTodo}} />`,
      );
    });

    test('it renders each todo', async function (assert) {
      assert.dom('[data-test-todo-name]').exists({ count: 2 });
      assert.dom('[data-test-todo-name]').hasText(todos[0].name);
    });

    test('it calls onChooseTodo when clicking a todo', async function (assert) {
      await click('[data-test-todo] button');
      assert.equal(
        handleChooseTodo.getCall(0).args,
        todos[0],
        'passed todo to onChooseTodo',
      );
    });
  });
});
