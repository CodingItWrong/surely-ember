import { render, fillIn, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | search-form', function (hooks) {
  setupRenderingTest(hooks);

  module('on submit', function (hooks) {
    const searchText = 'Search Text';
    let onSearch;

    hooks.beforeEach(async function () {
      onSearch = sinon.spy();

      this.set('onSearch', onSearch);
      await render(hbs`<SearchForm @onSearch={{onSearch}} />`);

      await fillIn('[data-test-search-field] input', searchText);
      await triggerEvent('[data-test-search-form]', 'submit');
    });

    test('it calls onSearch with the search text', async function (assert) {
      assert.ok(onSearch.calledWith(searchText));
    });

    test('it does not clear the text field', async function (assert) {
      assert.dom('[data-test-search-field] input').hasValue(searchText);
    });
  });
});
