import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | category-detail', function (hooks) {
  setupRenderingTest(hooks);

  module('error loading', function () {
    test('it displays an error message', async function (assert) {
      await render(hbs`<CategoryDetail @error={{true}} />`);
      assert.dom('[data-test-error-message]').hasText('Error loading category');
    });
  });
});
