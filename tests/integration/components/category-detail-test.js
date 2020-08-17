import { click, render } from '@ember/test-helpers';
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
  });
});
