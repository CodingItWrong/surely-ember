import {
  click,
  fillIn,
  // eslint-disable-next-line no-unused-vars
  pauseTest,
  triggerEvent,
  visit,
} from '@ember/test-helpers';
import addWeeks from 'date-fns/addWeeks';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { module, test } from 'qunit';
import { formatDate } from 'surely/utils';

module('Acceptance | managing todos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it allows adding, editing, and deleting todos', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click('[data-test-available] button');

    // add todo
    const todoName = 'New Todo';
    await fillIn('[data-test-new-todo-field] textarea', todoName);
    await triggerEvent('[data-test-new-todo-form]', 'submit');
    assert.dom('[data-test-todo-name]').hasText(todoName);

    // defer one day
    await click('[data-test-todo] button');
    assert.dom('[data-test-todo-name]').hasText(todoName);
    assert.dom('[data-test-deferred-until]').doesNotExist();
    await click('[data-test-defer-button]');
    await click('[data-test-defer-one-day-button]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click('[data-test-future] button');
    assert.dom('[data-test-todo-name]').hasText(todoName);
    assert.dom('[data-test-group-deferred-until]').hasText('Tomorrow (1)');
    await click('[data-test-todo] button');
    assert.dom('[data-test-deferred-until]').hasText('Deferred until tomorrow');

    // confirm it shows on the tomorrow page
    await click('[data-test-tomorrow] button');
    assert.dom('[data-test-todo-name]').hasText(todoName);
    await click('[data-test-todo] button');

    // editing
    await click('[data-test-edit-button]');
    const updatedTodoName = 'Updated Todo';
    await fillIn('[data-test-todo-name-field] textarea', updatedTodoName);
    await fillIn('[data-test-deferred-until-field] input', '');
    await click('[data-test-save-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click('[data-test-available] button');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    await click('[data-test-todo] button');
    assert.dom('[data-test-deferred-until]').doesNotExist();

    // defer until date
    await click('[data-test-defer-button]');
    await click('[data-test-defer-until-date-button]');

    const oneWeek = formatDate(addWeeks(new Date(), 1));
    await fillIn('[data-test-deferred-until-field] input', oneWeek);
    await click('[data-test-defer-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click('[data-test-future] button');
    await click('[data-test-todo] button');
    assert.dom('[data-test-deferred-until]').exists();

    // complete
    await click('[data-test-complete-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click('[data-test-completed] button');
    await click('[data-test-todo] button');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    assert.dom('[data-test-completed-at]').hasText(/Completed today at/);

    // Uncomplete
    await click('[data-test-uncomplete-button]');
    assert.dom('[data-test-completed-at]').doesNotExist();
    await click('[data-test-back-to-completed-list]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click('[data-test-future] button');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);

    // delete
    await click('[data-test-todo] button');
    await click('[data-test-delete-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click('[data-test-deleted] button');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    await click('[data-test-todo] button');
    assert.dom('[data-test-deleted-at]').exists();

    // undelete
    await click('[data-test-undelete-button]');
    assert.dom('[data-test-deleted-at]').doesNotExist();
    await click('[data-test-back-to-deleted-list]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click('[data-test-future] button');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
  });
});
