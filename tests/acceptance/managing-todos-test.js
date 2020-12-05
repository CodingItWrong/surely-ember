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
import { module as describe, test as it } from 'qunit';
import { formatDate } from 'surely/utils';
import {
  AVAILABLE_NAV,
  COMPLETED_NAV,
  DELETED_NAV,
  FUTURE_NAV,
  NEW_TODO_FIELD,
  TODO_NAME_FIELD,
  TOMORROW_NAV,
} from '../constants';

describe('Acceptance | managing todos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  it('allows adding, editing, and deleting todos', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(AVAILABLE_NAV);

    // add todo
    const todoName = 'New Todo';
    await fillIn(NEW_TODO_FIELD, todoName);
    await triggerEvent('[data-test-new-todo-form]', 'submit');
    assert.dom('[data-test-todo-name]').hasText(todoName);

    // defer one day
    await click('[data-test-todo]');
    assert.dom('[data-test-todo-name]').hasText(todoName);
    assert.dom('[data-test-deferred-until]').doesNotExist();
    await click('[data-test-defer-button]');
    await click('[data-test-defer-one-day-button]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click(FUTURE_NAV);
    assert.dom('[data-test-todo-name]').hasText(todoName);
    assert.dom('[data-test-group-deferred-until]').hasText('Tomorrow (1)');
    await click('[data-test-todo]');
    assert.dom('[data-test-deferred-until]').hasText('Deferred until tomorrow');

    // confirm it shows on the tomorrow page
    await click(TOMORROW_NAV);
    assert.dom('[data-test-todo-name]').hasText(todoName);
    await click('[data-test-todo]');

    // editing
    await click('[data-test-edit-button]');
    const updatedTodoName = 'Updated Todo';
    await fillIn(TODO_NAME_FIELD, updatedTodoName);
    await fillIn('[data-test-deferred-until-field] input', '');
    await click('[data-test-save-button]');
    await click('[data-test-back-to-tomorrow-list]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click(AVAILABLE_NAV);
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    await click('[data-test-todo]');
    assert.dom('[data-test-deferred-until]').doesNotExist();

    // defer until date
    await click('[data-test-defer-button]');
    await click('[data-test-defer-until-date-button]');

    const oneWeek = formatDate(addWeeks(new Date(), 1));
    await fillIn('[data-test-deferred-until-field] input', oneWeek);
    await click('[data-test-defer-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click(FUTURE_NAV);
    await click('[data-test-todo]');
    assert.dom('[data-test-deferred-until]').exists();

    // complete
    await click('[data-test-complete-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click(COMPLETED_NAV);
    await click('[data-test-todo]');
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    assert.dom('[data-test-completed-at]').hasText(/Completed today at/);

    // Uncomplete
    await click('[data-test-uncomplete-button]');
    assert.dom('[data-test-completed-at]').doesNotExist();
    await click('[data-test-back-to-completed-list]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click(FUTURE_NAV);
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);

    // delete
    await click('[data-test-todo]');
    await click('[data-test-delete-button]');
    assert.dom('[data-test-todo]').doesNotExist();
    await click(DELETED_NAV);
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
    await click('[data-test-todo]');
    assert.dom('[data-test-deleted-at]').exists();

    // undelete
    await click('[data-test-undelete-button]');
    assert.dom('[data-test-deleted-at]').doesNotExist();
    await click('[data-test-back-to-deleted-list]');
    assert.dom('[data-test-todo]').doesNotExist();

    await click(FUTURE_NAV);
    assert.dom('[data-test-todo-name]').hasText(updatedTodoName);
  });
});
