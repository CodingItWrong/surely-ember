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
  COMPLETED_NAV,
  DELETED_NAV,
  FUTURE_NAV,
  SEARCH_FIELD,
} from '../constants';

describe('Acceptance | searching', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  it('allows searching future todos', async function (assert) {
    const todo1 = 'One Todo';
    const todo2 = 'Another Todo';
    const future = formatDate(addWeeks(new Date(), 1));

    this.server.create('todo', { name: todo1, deferredUntil: future });
    this.server.create('todo', { name: todo2, deferredUntil: future });

    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(FUTURE_NAV);

    await fillIn(SEARCH_FIELD, todo1);
    await triggerEvent('[data-test-search-form]', 'submit');
    assert.dom('[data-test-todo-name]').exists({ count: 1 });
    assert.dom('[data-test-todo-name]').hasText(todo1);
  });

  it('allows searching completed todos', async function (assert) {
    const todo1 = 'One Todo';
    const todo2 = 'Another Todo';
    const past = formatDate(addWeeks(new Date(), -1));

    this.server.create('todo', { name: todo1, completedAt: past });
    this.server.create('todo', { name: todo2, completedAt: past });

    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(COMPLETED_NAV);

    await fillIn(SEARCH_FIELD, todo1);
    await triggerEvent('[data-test-search-form]', 'submit');
    assert.dom('[data-test-todo-name]').exists({ count: 1 });
    assert.dom('[data-test-todo-name]').hasText(todo1);
  });

  it('allows searching deleted todos', async function (assert) {
    const todo1 = 'One Todo';
    const todo2 = 'Another Todo';
    const past = formatDate(addWeeks(new Date(), -1));

    this.server.create('todo', { name: todo1, deletedAt: past });
    this.server.create('todo', { name: todo2, deletedAt: past });

    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(DELETED_NAV);

    await fillIn(SEARCH_FIELD, todo1);
    await triggerEvent('[data-test-search-form]', 'submit');
    assert.dom('[data-test-todo-name]').exists({ count: 1 });
    assert.dom('[data-test-todo-name]').hasText(todo1);
  });
});
