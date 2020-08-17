import { click, fillIn, render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | category-detail', function (hooks) {
  setupRenderingTest(hooks);

  module('error loading', function () {
    test('it displays an error message', async function (assert) {
      await render(hbs`<CategoryDetail @error={{true}} />`);
      assert.dom('[data-test-error-message]').hasText('Error loading category');
    });
  });

  // TODO creating new record

  module('editing', function () {
    module('on cancel', function (hooks) {
      let onCancel;

      hooks.beforeEach(async function () {
        onCancel = sinon.spy();
        this.set('category', {});
        this.set('onCancel', onCancel);
        await render(
          hbs`<CategoryDetail @category={{category}} @onCancel={{onCancel}} />`,
        );

        await click('[data-test-cancel-edit-button]');
      });

      test('it calls onCancel', async function (assert) {
        assert.ok(onCancel.calledOnce, 'calls onCancel');
      });
    });

    module('on success', function (hooks) {
      const newName = 'New Name';

      let category;
      let onSave;

      hooks.beforeEach(async function () {
        category = {
          id: 1,
          name: 'Old Name',
          save: sinon.stub().resolves(),
        };
        onSave = sinon.spy();

        this.set('category', category);
        this.set('onSave', onSave);
        await render(
          hbs`<CategoryDetail @category={{category}} @onSave={{onSave}} />`,
        );

        await fillIn('[data-test-category-name-field] textarea', newName);
        await triggerEvent('[data-test-category-edit-form]', 'submit');
      });

      test('it saves the category', async function (assert) {
        assert.equal(category.name, newName, 'set name');
        assert.ok(category.save.calledOnce, 'save called');
      });

      test('it calls onSave', function (assert) {
        assert.ok(onSave.calledOnce, 'calls onSave');
      });
    });

    // TODO test not calling onSave for todo detail
    module('on error', function (hooks) {
      let category;
      let onSave;

      hooks.beforeEach(async function () {
        category = {
          id: 1,
          name: 'Name',
          save: sinon.stub().rejects(),
        };
        onSave = sinon.spy();

        this.set('category', category);
        this.set('onSave', onSave);
        await render(
          hbs`<CategoryDetail @category={{category}} @onSave={{onSave}} />`,
        );

        await triggerEvent('[data-test-category-edit-form]', 'submit');
      });

      test('it displays an error', function (assert) {
        assert
          .dom('[data-test-error-message]')
          .hasText('An error occurred saving the category.');
      });

      test('it does not call onSave', function (assert) {
        assert.equal(onSave.getCalls().length, 0, 'onSave not called');
      });
    });
  });
});
