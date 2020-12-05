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
import { NEW_TODO_FIELD, TOMORROW_NAV } from '../constants';

describe('Acceptance | adding tomorrow todos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  it('allows adding a todo for tomorrow directly', async function (assert) {
    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click(TOMORROW_NAV);
    const todoName = 'New Todo';
    await fillIn(NEW_TODO_FIELD, todoName);
    await triggerEvent('[data-test-new-todo-form]', 'submit');
    assert.dom('[data-test-todo-name]').hasText(todoName);
    await click('[data-test-todo]');
    assert.dom('[data-test-deferred-until]').hasText('Deferred until tomorrow');
  });
});
