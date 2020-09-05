import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';

describe('Integration | Component | pagination-controls', function (hooks) {
  setupRenderingTest(hooks);

  describe('when no pages', function () {
    it('renders nothing', async function (assert) {
      await render(hbs`<PaginationControls @totalPages={{0}} />`);

      assert.equal(this.element.textContent.trim(), '');
    });
  });

  describe('when one page', function (hooks) {
    hooks.beforeEach(async function () {
      await render(
        hbs`<PaginationControls @totalPages={{1}} @pageNumber={{1}} />`,
      );
    });

    it('disables the previous button', function (assert) {
      assert.dom('[data-test-previous-button]').hasAttribute('disabled');
    });

    it('disables the next button', function (assert) {
      assert.dom('[data-test-next-button]').hasAttribute('disabled');
    });
  });

  describe('when on first of multiple pages', function (hooks) {
    let nextPage;

    hooks.beforeEach(async function () {
      nextPage = sinon.spy();
      this.set('nextPage', nextPage);
      await render(
        hbs`<PaginationControls @totalPages={{3}} @pageNumber={{1}} @nextPage={{nextPage}} />`,
      );
    });

    it('disables the previous button', function (assert) {
      assert.dom('[data-test-previous-button]').hasAttribute('disabled');
    });

    it('calls nextPage when clicking the next page button', async function (assert) {
      assert.dom('[data-test-next-button]').doesNotHaveAttribute('disabled');
      await click('[data-test-next-button]');
      assert.ok(nextPage.calledOnce, 'nextPage called');
    });
  });

  describe('when on middle of multiple pages', function (hooks) {
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

    it('calls prevPage when clicking the previous page button', async function (assert) {
      assert
        .dom('[data-test-previous-button]')
        .doesNotHaveAttribute('disabled');
      await click('[data-test-previous-button]');
      assert.ok(prevPage.calledOnce, 'prevPage called');
    });

    it('calls nextPage when clicking the next page button', async function (assert) {
      assert.dom('[data-test-next-button]').doesNotHaveAttribute('disabled');
      await click('[data-test-next-button]');
      assert.ok(nextPage.calledOnce, 'nextPage called');
    });
  });

  describe('when on last of multiple pages', function (hooks) {
    let prevPage;

    hooks.beforeEach(async function () {
      prevPage = sinon.spy();
      this.set('prevPage', prevPage);
      await render(
        hbs`<PaginationControls @totalPages={{3}} @pageNumber={{3}} @prevPage={{prevPage}} />`,
      );
    });

    it('calls prevPage when clicking the next page button', async function (assert) {
      assert
        .dom('[data-test-previous-button]')
        .doesNotHaveAttribute('disabled');
      await click('[data-test-previous-button]');
      assert.ok(prevPage.calledOnce, 'prevPage called');
    });

    it('disables the next button', function (assert) {
      assert.dom('[data-test-next-button]').hasAttribute('disabled');
    });
  });
});
