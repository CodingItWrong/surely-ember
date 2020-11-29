import { fillIn, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | new-todo-form', function (hooks) {
  setupRenderingTest(hooks);

  const todoName = 'Todo Name';
  const deferredUntil = new Date();

  let todos;
  let handleCreate;

  describe('success', function (hooks) {
    hooks.beforeEach(async function () {
      handleCreate = sinon.spy();
      todos = {
        create: sinon.stub().resolves({
          success: true,
        }),
      };

      this.owner.register('service:todos', todos, { instantiate: false });
      this.set('handleCreate', handleCreate);
      this.set('deferredUntil', deferredUntil);
      await render(hbs`
        <NewTodoForm
          @deferredUntil={{deferredUntil}}
          @handleCreate={{handleCreate}}
        />
      `);

      await fillIn('[data-test-new-todo-field] textarea', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('calls todos.create with the inputted todo and deferredUntil argument', function (assert) {
      assert.ok(
        todos.create.calledWith({
          name: todoName,
          deferredUntil,
        }),
      );
    });

    it('calls handleCreate with no argument', function (assert) {
      assert.ok(handleCreate.calledWith());
    });

    it('clears the text field', function (assert) {
      assert.dom('[data-test-new-todo-field] textarea').hasValue('');
    });

    it('does not display an error', function (assert) {
      assert.dom('[data-test-error]').doesNotExist();
    });
  });

  describe('when there is an error saving', function (hooks) {
    const errorMessage = 'This is the error';

    hooks.beforeEach(async function () {
      handleCreate = sinon.spy();
      todos = {
        create: sinon.stub().resolves({
          success: false,
          errors: {
            name: errorMessage,
          },
        }),
      };

      this.owner.register('service:todos', todos, { instantiate: false });
      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await fillIn('[data-test-new-todo-field] textarea', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('displays the error message', async function (assert) {
      assert.dom('[data-test-error-message]').hasText(errorMessage);
    });

    it('does not clear the text field', function (assert) {
      assert.dom('[data-test-new-todo-field] textarea').hasValue(todoName);
    });

    it('does not call handleCreate', async function (assert) {
      assert.ok(handleCreate.notCalled, 'handleCreate not called');
    });
  });

  describe('submitting after an error', function (hooks) {
    hooks.beforeEach(async function () {
      handleCreate = sinon.spy();
      todos = {
        create: sinon
          .stub()
          .onFirstCall()
          .resolves({
            success: false,
          })
          .onSecondCall()
          .resolves({ success: true }),
      };

      this.owner.register('service:todos', todos, { instantiate: false });
      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await triggerEvent('[data-test-new-todo-form]', 'submit');
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('clears the error', function (assert) {
      assert.dom('[data-test-error]').doesNotExist();
    });
  });
});
