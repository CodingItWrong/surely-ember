import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | new-todo-form', function (hooks) {
  setupRenderingTest(hooks);

  module('success', function (hooks) {
    const todoName = 'Todo Name';

    let handleCreate;

    hooks.beforeEach(async function () {
      handleCreate = sinon.stub().resolves();

      this.set('handleCreate', handleCreate);
      await render(hbs`<NewTodoForm @handleCreate={{handleCreate}} />`);

      await fillIn('[data-test-new-todo-field] input', todoName);
      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    test('it passes the todo name to handleCreate', function (assert) {
      assert.ok(handleCreate.calledWith(todoName));
    });

    test('it clears the text field', function (assert) {
      assert.dom('[data-test-new-todo-field] input').hasValue('');
    });

    test('it does not display an error', function (assert) {
      assert.dom('[data-test-error]').doesNotExist();
    });
  });

  module('when submitting with no todo name', function (hooks) {
    let onAdd;

    hooks.beforeEach(async function () {
      onAdd = sinon.spy();

      this.set('onAdd', onAdd);
      await render(hbs`<NewTodoForm @onAdd={{onAdd}} />`);

      await triggerEvent('[data-test-new-todo-form]', 'submit');
    });

    test('it displays a validation error', async function (assert) {
      assert.dom('[data-test-error]').hasText('Please enter a todo.');
    });

    test('it does not call onAdd', async function (assert) {
      assert.ok(onAdd.notCalled, 'onAdd not called');
    });
  });
});
