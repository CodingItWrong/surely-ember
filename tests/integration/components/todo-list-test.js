import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | todo-list', function (hooks) {
  setupRenderingTest(hooks);

  describe('when loading', function () {
    it('shows a loading indicator', async function (assert) {
      await render(hbs`<TodoList @loading={{true}} />`);

      assert.dom('[data-test-loading-indicator]').exists();
    });
  });

  describe('when errored', function () {
    it('shows an error message', async function (assert) {
      await render(hbs`<TodoList @error={{true}} />`);

      assert
        .dom('[data-test-error-message]')
        .hasText('An error occurred loading todos.');
    });
  });

  describe('no todos found in search', function () {
    it('displays the not found message', async function (assert) {
      const todos = [];

      this.set('todos', todos);
      await render(hbs`<TodoList @todos={{todos}} @isSearching={{true}} />`);

      assert.dom('[data-test-no-todos-message]').hasText('No todos found');
    });
  });

  describe('no todos outside of search', function () {
    it('displays the passed-in message', async function (assert) {
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

  describe('individual todos', function (hooks) {
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

    it('renders each todo', async function (assert) {
      assert.dom('[data-test-todo-name]').exists({ count: 2 });
      assert.dom('[data-test-todo-name]').hasText(todos[0].name);
    });

    it('calls onChooseTodo when clicking a todo', async function (assert) {
      await click('[data-test-todo] button');
      assert.equal(
        handleChooseTodo.getCall(0).args[0],
        todos[0],
        'passed todo to onChooseTodo',
      );
    });
  });

  describe('grouped todos', function (hooks) {
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

    it('renders each group heading and todo', async function (assert) {
      assert.dom('[data-test-group-deferred-until]').exists({ count: 2 });
      assert.dom('[data-test-group-deferred-until]').hasText('Tomorrow (1)');

      assert.dom('[data-test-todo-name]').exists({ count: 2 });
      assert.dom('[data-test-todo-name]').hasText(groups[0].todos[0].name);
    });

    it('calls onChooseTodo when clicking a todo', async function (assert) {
      await click('[data-test-todo] button');
      assert.equal(
        handleChooseTodo.getCall(0).args[0],
        groups[0].todos[0],
        'passed todo to onChooseTodo',
      );
    });
  });

  describe('block form', function () {
    it('renders the block for each todo', async function (assert) {
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
