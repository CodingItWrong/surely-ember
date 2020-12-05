import {
  click,
  fillIn,
  // eslint-disable-next-line no-unused-vars
  pauseTest,
  triggerEvent,
  visit,
} from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { module as describe, test as it } from 'qunit';
import { CATEGORIES_NAV } from '../constants';

describe('Acceptance | managing categories', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  it('allows adding, editing, and deleting categories', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(CATEGORIES_NAV);

    // add category
    const categoryName = 'New Category';
    await click('[data-test-add-button]');
    await fillIn('[data-test-category-name-field] input', categoryName);
    await triggerEvent('[data-test-category-edit-form]', 'submit');
    assert.dom('[data-test-category-name]').hasText(categoryName);

    // editing
    await click('[data-test-category] button');
    const updatedCategoryName = 'Updated Category';
    await fillIn('[data-test-category-name-field] input', updatedCategoryName);
    await triggerEvent('[data-test-category-edit-form]', 'submit');
    assert.dom('[data-test-category-name]').hasText(updatedCategoryName);
    await click('[data-test-category] button');

    // deleting
    await click('[data-test-delete-button]');
    assert.dom('[data-test-todo]').doesNotExist();
  });
});
