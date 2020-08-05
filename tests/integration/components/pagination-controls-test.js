import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

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

  module('when on first of multiple pages', function (hooks) {
    let nextPage;

    hooks.beforeEach(async function () {
      nextPage = sinon.spy();
      this.set('nextPage', nextPage);
      await render(
        hbs`<PaginationControls @totalPages={{3}} @pageNumber={{1}} @nextPage={{nextPage}} />`,
      );
    });

    test('it disables the previous button', function (assert) {
      assert.dom('[data-test-previous-button]').hasAttribute('disabled');
    });

    test('it calls nextPage when clicking the next page button', async function (assert) {
      await click('[data-test-next-button]');
      assert.ok(nextPage.calledOnce, 'nextPage called');
    });
  });
});