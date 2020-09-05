import { fillIn, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | new-todo-form', function (hooks) {
  setupRenderingTest(hooks);

  describe('success', function (hooks) {
    const todoName = 'Todo Name';

    let handleCreate;

    hooks.beforeEach(async function () {
      handleCreate = sinon.stub().resolves();

      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await fillIn('[data-test-new-todo-field] textarea', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('passes the todo name to handleCreate', function (assert) {
      assert.ok(handleCreate.calledWith(todoName));
    });

    it('clears the text field', function (assert) {
      assert.dom('[data-test-new-todo-field] textarea').hasValue('');
    });

    it('does not display an error', function (assert) {
      assert.dom('[data-test-error]').doesNotExist();
    });
  });

  describe('when submitting with no todo name', function (hooks) {
    let handleCreate;

    hooks.beforeEach(async function () {
      handleCreate = sinon.spy();

      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('displays a validation error', async function (assert) {
      assert.dom('[data-test-error]').hasText('Please enter a todo.');
    });

    it('does not call handleCreate', async function (assert) {
      assert.ok(handleCreate.notCalled, 'handleCreate not called');
    });
  });

  describe('when there is an error saving', function (hooks) {
    const todoName = 'Todo Name';
    let handleCreate;

    hooks.beforeEach(async function () {
      handleCreate = sinon.stub().rejects();

      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await fillIn('[data-test-new-todo-field] textarea', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('displays the error message', async function (assert) {
      assert
        .dom('[data-test-error]')
        .hasText('An error occurred adding the todo.');
    });

    it('does not clear the text field', function (assert) {
      assert.dom('[data-test-new-todo-field] textarea').hasValue(todoName);
    });
  });

  describe('submitting after an error', function (hooks) {
    const todoName = 'Todo Name';

    let handleCreate;

    hooks.beforeEach(async function () {
      handleCreate = sinon.stub().resolves();

      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await triggerEvent('[data-test-new-todo-form]', 'submit');
      await fillIn('[data-test-new-todo-field] textarea', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    it('clears the error', function (assert) {
      assert.dom('[data-test-error]').doesNotExist();
    });
  });
});
