import { module, test } from 'qunit';
import {
  visit,
  click,
  fillIn,
  triggerEvent,
  // eslint-disable-next-line no-unused-vars
  pauseTest,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | managing categories', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it allows adding, editing, and deleting categories', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click('[data-test-categories] button');

    // add category
    const categoryName = 'New Category';
    await click('[data-test-add-button]');
    await fillIn('[data-test-category-name-field] textarea', categoryName);
    await fillIn('[data-test-sort-order-field] input', '1');
    await triggerEvent('[data-test-category-edit-form]', 'submit');
    assert.dom('[data-test-category-name]').hasText(categoryName);

    // editing
    await click('[data-test-category] button');
    assert.dom('[data-test-sort-order-field] input').hasValue('1');
    const updatedCategoryName = 'Updated Category';
    await fillIn(
      '[data-test-category-name-field] textarea',
      updatedCategoryName,
    );
    await fillIn('[data-test-sort-order-field] input', '2');
    await triggerEvent('[data-test-category-edit-form]', 'submit');
    assert.dom('[data-test-category-name]').hasText(updatedCategoryName);
    await click('[data-test-category] button');
    assert.dom('[data-test-sort-order-field] input').hasValue('2');
  });
});
