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

  module('when on middle of multiple pages', function (hooks) {
    let prevPage;
    let nextPage;

    hooks.beforeEach(async function () {
      prevPage = sinon.spy();
      nextPage = sinon.spy();
      this.set('prevPage', prevPage);
      this.set('nextPage', nextPage);
      await render(
        hbs`<PaginationControls @totalPages={{3}} @pageNumber={{2}} @prevPage={{prevPage}} @nextPage={{nextPage}} />`,
      );
    });

    test('it calls prevPage when clicking the previous page button', async function (assert) {
      await click('[data-test-previous-button]');
      assert.ok(prevPage.calledOnce, 'prevPage called');
    });

    test('it calls nextPage when clicking the next page button', async function (assert) {
      await click('[data-test-next-button]');
      assert.ok(nextPage.calledOnce, 'nextPage called');
    });
  });

  module('when on last of multiple pages', function (hooks) {
    let prevPage;

    hooks.beforeEach(async function () {
      prevPage = sinon.spy();
      this.set('prevPage', prevPage);
      await render(
        hbs`<PaginationControls @totalPages={{3}} @pageNumber={{3}} @prevPage={{prevPage}} />`,
      );
    });

    test('it calls prevPage when clicking the next page button', async function (assert) {
      await click('[data-test-previous-button]');
      assert.ok(prevPage.calledOnce, 'prevPage called');
    });

    test('it disables the next button', function (assert) {
      assert.dom('[data-test-next-button]').hasAttribute('disabled');
    });
  });
});
