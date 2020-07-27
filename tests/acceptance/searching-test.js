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
import addWeeks from 'date-fns/addWeeks';
import format from 'date-fns/format';

const FORMAT_STRING = 'yyyy-MM-dd';

module('Acceptance | searching', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it allows searching future todos', async function (assert) {
    const todo1 = 'One Todo';
    const todo2 = 'Another Todo';
    const future = format(addWeeks(new Date(), 1), FORMAT_STRING);

    this.server.create('todo', { name: todo1, deferredUntil: future });
    this.server.create('todo', { name: todo2, deferredUntil: future });

    await authenticateSession({ access_token: 'ABC123' });

    await visit('/');
    await click('[data-test-future] button');

    await fillIn('[data-test-search-field] input', todo1);
    await triggerEvent('[data-test-search-form]', 'submit');
    assert.dom('[data-test-todo-name]').exists({ count: 1 });
    assert.dom('[data-test-todo-name]').hasText(todo1);
  });
});
