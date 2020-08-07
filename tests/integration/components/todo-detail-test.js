import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  triggerEvent,
  // eslint-disable-next-line no-unused-vars
  pauseTest,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import set from 'date-fns/set';
import addDays from 'date-fns/addDays';
import sinon from 'sinon';
import { formatDate } from 'surely/utils';

module('Integration | Component | todo-detail', function (hooks) {
  setupRenderingTest(hooks);

  // TODO: editing, loading states

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

    module('deferring', function () {
      module('cancelling', function (hooks) {
        hooks.beforeEach(async function () {
          this.set('todo', {});
          await render(hbs`<TodoDetail @todo={{todo}} />`);

          await click('[data-test-defer-button]');
          await click('[data-test-cancel-defer-button]');
        });

        test('it hides the defer options', function (assert) {
          assert.dom('[data-test-defer-one-day-button]').doesNotExist();
        });
      });

      module('by one day', function () {
        module('on success', function (hooks) {
          let todo;
          let onHandle;

          hooks.beforeEach(async function () {
            todo = {
              deferDays: sinon.spy(),
              save: sinon.stub().resolves(),
            };
            onHandle = sinon.spy();
            this.set('todo', todo);
            this.set('onHandle', onHandle);
            await render(
              hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
            );

            await click('[data-test-defer-button]');
            await click('[data-test-defer-one-day-button]');
          });

          test('it defers the todo by one day', function (assert) {
            assert.ok(todo.deferDays.getCall(0).args, [1], 'deferred one day');
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
              deferDays: sinon.spy(),
              save: sinon.stub().rejects(),
            };
            onHandle = sinon.spy();
            this.set('todo', todo);
            this.set('onHandle', onHandle);
            await render(
              hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
            );

            await click('[data-test-defer-button]');
            await click('[data-test-defer-one-day-button]');
          });

          test('it displays an error', function (assert) {
            assert
              .dom('[data-test-error-message]')
              .hasText('An error occurred while deferring the todo.');
          });

          test('it does not call onHandle', function (assert) {
            assert.ok(onHandle.notCalled, 'onHandle not called');
          });
        });
      });

      module('by two days', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            deferDays: sinon.spy(),
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-defer-button]');
          await click('[data-test-defer-two-days-button]');
        });

        test('it defers the todo by two days', function (assert) {
          assert.ok(todo.deferDays.getCall(0).args, [2], 'deferred two days');
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      module('by three days', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            deferDays: sinon.spy(),
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-defer-button]');
          await click('[data-test-defer-three-days-button]');
        });

        test('it defers the todo by three days', function (assert) {
          assert.ok(todo.deferDays.getCall(0).args, [3], 'deferred three days');
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      module('by a week', function (hooks) {
        let todo;
        let onHandle;

        hooks.beforeEach(async function () {
          todo = {
            deferDays: sinon.spy(),
            save: sinon.stub().resolves(),
          };
          onHandle = sinon.spy();
          this.set('todo', todo);
          this.set('onHandle', onHandle);
          await render(
            hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
          );

          await click('[data-test-defer-button]');
          await click('[data-test-defer-one-week-button]');
        });

        test('it defers the todo by one week', function (assert) {
          assert.ok(todo.deferDays.getCall(0).args, [7], 'deferred one week');
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      module('until a chosen date', function () {
        const dateString = '2030-01-01';

        module('cancelling', function (hooks) {
          hooks.beforeEach(async function () {
            this.set('todo', {});
            await render(hbs`<TodoDetail @todo={{todo}} />`);

            await click('[data-test-defer-button]');
            await click('[data-test-defer-until-date-button]');
            await click('[data-test-cancel-defer-until-date-button]');
          });

          test('it hides the defer options', function (assert) {
            assert.dom('[data-test-deferred-until-field]').doesNotExist();
            assert.dom('[data-test-defer-one-day-button]').doesNotExist();
          });
        });

        module('on success', function (hooks) {
          let todo;
          let onHandle;

          hooks.beforeEach(async function () {
            todo = {
              deferUntilDate: sinon.spy(),
              save: sinon.stub().resolves(),
            };
            onHandle = sinon.spy();
            this.set('todo', todo);
            this.set('onHandle', onHandle);
            await render(
              hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
            );

            await click('[data-test-defer-button]');
            await click('[data-test-defer-until-date-button]');
            await fillIn('[data-test-deferred-until-field] input', dateString);
            await click('[data-test-defer-button]');
          });

          test('it defers the todo until the chosen date', function (assert) {
            assert.equal(
              formatDate(todo.deferUntilDate.getCall(0).args[0]),
              dateString,
              'deferred one week',
            );
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
              deferUntilDate: sinon.spy(),
              save: sinon.stub().rejects(),
            };
            onHandle = sinon.spy();
            this.set('todo', todo);
            this.set('onHandle', onHandle);
            await render(
              hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`,
            );

            await click('[data-test-defer-button]');
            await click('[data-test-defer-until-date-button]');
            await fillIn('[data-test-deferred-until-field] input', dateString);
            await click('[data-test-defer-button]');
          });

          test('it displays an error', function (assert) {
            assert
              .dom('[data-test-error-message]')
              .hasText('An error occurred while deferring the todo.');
          });

          test('it does not call onHandle', function (assert) {
            assert.ok(onHandle.notCalled, 'onHandle not called');
          });
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

  module('editing', function () {
    module('on cancel', function (hooks) {
      hooks.beforeEach(async function () {
        this.set('todo', {});
        await render(hbs`<TodoDetail @todo={{todo}} />`);

        await click('[data-test-edit-button]');
        await click('[data-test-cancel-edit-button]');
      });

      test('it hides the edit form', async function (assert) {
        assert.dom('[data-test-todo-name-field]').doesNotExist();
      });
    });

    module('on success', function (hooks) {
      const newName = 'New Name';
      const newDeferDate = '2030-01-01';
      const newNotes = 'New Notes';

      let todo;

      hooks.beforeEach(async function () {
        todo = {
          id: 1,
          name: 'Old Name',
          notes: 'Old Notes',
          deferUntilDate: sinon.spy(),
          save: sinon.stub().resolves(),
        };

        this.set('todo', todo);
        await render(hbs`<TodoDetail @todo={{todo}} />`);

        await click('[data-test-edit-button]');
        await fillIn('[data-test-todo-name-field] textarea', newName);
        await fillIn('[data-test-deferred-until-field] input', newDeferDate);
        await fillIn('[data-test-notes-field] textarea', newNotes);
        await triggerEvent('[data-test-todo-edit-form]', 'submit');
      });

      test('it saves the todo', async function (assert) {
        assert.equal(todo.name, newName, 'set name');
        assert.equal(todo.notes, newNotes, 'set notes');
        assert.equal(
          formatDate(todo.deferUntilDate.getCall(0).args[0]),
          newDeferDate,
          'deferred one week',
        );
        assert.ok(todo.save.calledOnce, 'save called');
      });
    });

    module('on error', function (hooks) {
      let todo;

      hooks.beforeEach(async function () {
        todo = {
          id: 1,
          name: 'Name',
          deferUntilDate: sinon.spy(),
          save: sinon.stub().rejects(),
        };

        this.set('todo', todo);
        await render(hbs`<TodoDetail @todo={{todo}} />`);

        await click('[data-test-edit-button]');
        await triggerEvent('[data-test-todo-edit-form]', 'submit');
      });

      test('it displays an error', function (assert) {
        assert
          .dom('[data-test-error-message]')
          .hasText('An error occurred saving the todo.');
      });
    });
  });
});
