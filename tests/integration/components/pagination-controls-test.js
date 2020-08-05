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

  module('when one page', function (hooks) {
    hooks.beforeEach(async function () {
      await render(
        hbs`<PaginationControls @totalPages={{1}} @pageNumber={{1}} />`,
      );
    });

    test('it disables the previous button', function (assert) {
      assert.dom('[data-test-previous-button]').hasAttribute('disabled');
    });

    test('it disables the next button', function (assert) {
      assert.dom('[data-test-next-button]').hasAttribute('disabled');
    });
  });
});
