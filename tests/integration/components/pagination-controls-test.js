import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pagination-controls', function (hooks) {
  setupRenderingTest(hooks);

  module('when no pages', function () {
    test('it renders nothing', async function (assert) {
      await render(hbs`<PaginationControls @totalPages={{0}} />`);

      assert.equal(this.element.textContent.trim(), '');
    });
  });
});
