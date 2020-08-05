import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | new-todo-form', function (hooks) {
  setupRenderingTest(hooks);

  module('when submitting with no todo name', () => {
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
