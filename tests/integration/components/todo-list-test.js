import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import addDays from 'date-fns/addDays';

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

  module('no todos found in search', function () {
    test('it displays the not found message', async function (assert) {
      const todos = [];

      this.set('todos', todos);
      await render(hbs`<TodoList @todos={{todos}} @isSearching={{true}} />`);

      assert.dom('[data-test-no-todos-message]').hasText('No todos found');
    });
  });

  module('no todos outside of search', function () {
    test('it displays the passed-in message', async function (assert) {
      const todos = [];
      const noTodosMessage = 'Custom message';

      this.set('todos', todos);
      this.set('noTodosMessage', noTodosMessage);
      await render(
        hbs`<TodoList @todos={{todos}} @isSearching={{false}} @noTodosMessage={{noTodosMessage}} />`,
      );

      assert.dom('[data-test-no-todos-message]').hasText(noTodosMessage);
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
        handleChooseTodo.getCall(0).args[0],
        todos[0],
        'passed todo to onChooseTodo',
      );
    });
  });

  module('grouped todos', function (hooks) {
    const now = new Date();
    const groups = [
      {
        name: 'Tomorrow',
        todos: [{ id: 1, name: 'Todo 1' }],
      },
      {
        name: 'Later',
        todos: [{ id: 2, name: 'Todo 2' }],
      },
    ];

    let handleChooseTodo;

    hooks.beforeEach(async function () {
      handleChooseTodo = sinon.spy();

      this.set('groups', groups);
      this.set('handleChooseTodo', handleChooseTodo);
      await render(
        hbs`<TodoList @groups={{groups}} @groupCounts={{true}} @onChooseTodo={{handleChooseTodo}} />`,
      );
    });

    test('it renders each group heading and todo', async function (assert) {
      assert.dom('[data-test-group-deferred-until]').exists({ count: 2 });
      assert.dom('[data-test-group-deferred-until]').hasText('Tomorrow (1)');

      assert.dom('[data-test-todo-name]').exists({ count: 2 });
      assert.dom('[data-test-todo-name]').hasText(groups[0].todos[0].name);
    });

    test('it calls onChooseTodo when clicking a todo', async function (assert) {
      await click('[data-test-todo] button');
      assert.equal(
        handleChooseTodo.getCall(0).args[0],
        groups[0].todos[0],
        'passed todo to onChooseTodo',
      );
    });
  });

  module('block form', function () {
    test('it renders the block for each todo', async function (assert) {
      const todos = [{ id: 1, name: 'Todo 1' }];
      const handleChooseTodo = () => {};

      this.set('todos', todos);
      this.set('handleChooseTodo', handleChooseTodo);
      await render(
        hbs`<TodoList
          @todos={{todos}}
          @onChooseTodo={{handleChooseTodo}}
          as |todo|
        >
          <div data-test-block-content>
            Block todo name {{todo.name}}
          </div>
        </TodoList>`,
      );

      assert
        .dom('[data-test-block-content]')
        .hasText(`Block todo name ${todos[0].name}`);
    });
  });
});
