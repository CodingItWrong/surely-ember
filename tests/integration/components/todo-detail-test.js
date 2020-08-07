import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, pauseTest } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import set from 'date-fns/set';
import addDays from 'date-fns/addDays';
import sinon from 'sinon';

module('Integration | Component | todo-detail', function (hooks) {
  setupRenderingTest(hooks);

  // TODO: deferring, editing

  module('error loading', function () {
    test('it displays an error message', async function (assert) {
      await render(hbs`<TodoDetail @error={{true}} />`);
      assert.dom('[data-test-error-message]').hasText('Error loading todo');
    });
  });

  module('available todo', function () {
    test('it displays todo info', async function (assert) {
      const now = new Date();
      const createdAt = set(now, { hours: 1, minutes: 23, seconds: 0 });
      const deferredUntil = addDays(now, -1);
      const todo = {
        id: 1,
        name: 'My Todo',
        notes: 'Todo notes.',
        createdAt,
        deferredUntil,
      };

      this.set('todo', todo);
      await render(hbs`<TodoDetail @todo={{todo}} />`);

      assert.dom('[data-test-todo-name]').hasText(todo.name);
      assert.dom('[data-test-todo-notes]').hasText(todo.notes);
      assert
        .dom('[data-test-deferred-until]')
        .hasText('Deferred until yesterday');
      assert.dom('[data-test-created-at]').hasText('Created today at 1:23 AM');
    });

    module('completing', function () {
      module('on success', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-complete-button]');
        });

        test('it marks the todo saved', function (assert) {
          assert.ok(todo.completedAt instanceof Date, 'completed date set');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        test('it calls onHandle', function (assert) {
          assert.ok(onHandle.calledOnce, 'calls onHandle');
        });
      });

      module('on error', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            save: sinon.stub().rejects(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-complete-button]');
        });

        test('it displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while completing the todo.');
        });

        test('it does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });
    });

    module('deleting', function () {
      module('on success', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-delete-button]');
        });

        test('it marks the todo deleted', function (assert) {
          assert.ok(todo.deletedAt instanceof Date, 'deleted date set');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        test('it calls onHandle', function (assert) {
          assert.ok(onHandle.calledOnce, 'calls onHandle');
        });
      });

      module('on error', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            save: sinon.stub().rejects(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-delete-button]');
        });

        test('it displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while deleting the todo.');
        });

        test('it does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });
    });
  });

  module('future todo', function () {
    test('it displays todo info', async function (assert) {
      const now = new Date();
      const deferredUntil = addDays(now, 1);
      const todo = {
        id: 1,
        deferredUntil,
      };

      this.set('todo', todo);
      await render(hbs`<TodoDetail @todo={{todo}} />`);

      assert
        .dom('[data-test-deferred-until]')
        .hasText('Deferred until tomorrow');
    });
  });

  module('completed todo', function () {
    test('it displays todo info', async function (assert) {
      const now = new Date();
      const completedAt = set(addDays(now, -1), {
        hours: 1,
        minutes: 23,
        seconds: 0,
      });
      const todo = {
        id: 1,
        isCompleted: true,
        completedAt,
      };

      this.set('todo', todo);
      await render(hbs`<TodoDetail @todo={{todo}} />`);

      assert
        .dom('[data-test-completed-at]')
        .hasText('Completed yesterday at 1:23 AM');
    });

    module('uncompleting', function () {
      module('on success', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            isCompleted: true,
            completedAt: new Date(),
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-uncomplete-button]');
        });

        test('it marks the todo saved', function (assert) {
          assert.equal(todo.completedAt, null, 'completed date set to null');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        test('it hides the completed date from the rendered component', async function (assert) {
          // ideally we would test that the component goes to an uncompleted
          // state, but this relies on computed model properties we aren't
          // integrating with. instead, we just test that the date is not
          // included in the completed-at area
          assert.dom('[data-test-completed-at]').hasText('Completed');
        });

        test('it does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'does not call onHandle');
        });
      });

      module('on error', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            isCompleted: true,
            completedAt: new Date(),
            save: sinon.stub().rejects(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-uncomplete-button]');
        });

        test('it displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while uncompleting the todo.');
        });
      });
    });
  });

  module('deleted todo', function () {
    test('it displays todo info', async function (assert) {
      const now = new Date();
      const deletedAt = set(addDays(now, -1), {
        hours: 1,
        minutes: 23,
        seconds: 0,
      });
      const todo = {
        id: 1,
        isDeleted: true,
        deletedAt,
      };

      this.set('todo', todo);
      await render(hbs`<TodoDetail @todo={{todo}} />`);

      assert
        .dom('[data-test-deleted-at]')
        .hasText('Deleted yesterday at 1:23 AM');
    });

    module('undeleting', function () {
      module('on success', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            isDeleted: true,
            deletedAt: new Date(),
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-undelete-button]');
        });

        test('it marks the todo undeleted', function (assert) {
          assert.equal(todo.deletedAt, null, 'deleted date set to null');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        test('it hides the deleted date from the rendered component', async function (assert) {
          assert.dom('[data-test-deleted-at]').hasText('Deleted');
        });

        test('it does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });

      module('on error', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            isDeleted: true,
            deletedAt: new Date(),
            save: sinon.stub().rejects(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-undelete-button]');
        });

        test('it displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while undeleting the todo.');
        });
      });
    });
  });
});
