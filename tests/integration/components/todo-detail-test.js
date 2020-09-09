import {
  click,
  fillIn,
  // eslint-disable-next-line no-unused-vars
  pauseTest,
  render,
  triggerEvent,
} from '@ember/test-helpers';
import addDays from 'date-fns/addDays';
import set from 'date-fns/set';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module as describe, test as it } from 'qunit';
import sinon from 'sinon';
import { formatDate } from 'surely/utils';

describe('Integration | Component | todo-detail', function (hooks) {
  setupRenderingTest(hooks);

  // TODO: loading states

  describe('error loading', function () {
    it('displays an error message', async function (assert) {
      await render(hbs`<TodoDetail @error={{true}} />`);
      assert.dom('[data-test-error-message]').hasText('Error loading todo');
    });
  });

  describe('available todo', function () {
    it('displays todo info', async function (assert) {
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

    describe('completing', function () {
      describe('on success', function (hooks) {
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

        it('marks the todo saved', function (assert) {
          assert.ok(todo.completedAt instanceof Date, 'completed date set');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        it('calls onHandle', function (assert) {
          assert.ok(onHandle.calledOnce, 'calls onHandle');
        });
      });

      describe('on error', function (hooks) {
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

        it('displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while completing the todo.');
        });

        it('does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });
    });

    describe('deleting', function () {
      describe('on success', function (hooks) {
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

        it('marks the todo deleted', function (assert) {
          assert.ok(todo.deletedAt instanceof Date, 'deleted date set');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        it('calls onHandle', function (assert) {
          assert.ok(onHandle.calledOnce, 'calls onHandle');
        });
      });

      describe('on error', function (hooks) {
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

        it('displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while deleting the todo.');
        });

        it('does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });
    });

    describe('deferring', function () {
      describe('cancelling', function (hooks) {
        hooks.beforeEach(async function () {
          this.set('todo', {});
          await render(hbs`<TodoDetail @todo={{todo}} />`);

          await click('[data-test-defer-button]');
          await click('[data-test-cancel-defer-button]');
        });

        it('hides the defer options', function (assert) {
          assert.dom('[data-test-defer-one-day-button]').doesNotExist();
        });
      });

      describe('by one day', function () {
        describe('on success', function (hooks) {
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
            await click('[data-test-defer-one-day-button]');
          });

          it('defers the todo by one day', function (assert) {
            assert.ok(todo.deferUntilDate.calledOnce, 'deferUntilDate called'); // TODO test argument
            assert.ok(todo.save.calledOnce, 'save called');
          });

          it('calls onHandle', function (assert) {
            assert.ok(onHandle.calledOnce, 'calls onHandle');
          });
        });

        describe('on error', function (hooks) {
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
            await click('[data-test-defer-one-day-button]');
          });

          it('displays an error', function (assert) {
            assert
              .dom('[data-test-error-message]')
              .hasText('An error occurred while deferring the todo.');
          });

          it('does not call onHandle', function (assert) {
            assert.ok(onHandle.notCalled, 'onHandle not called');
          });
        });
      });

      describe('by two days', function (hooks) {
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
          await click('[data-test-defer-two-days-button]');
        });

        it('defers the todo by two days', function (assert) {
          assert.ok(todo.deferUntilDate.calledOnce, 'deferUntilDate called'); // TODO test argument
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      describe('by three days', function (hooks) {
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
          await click('[data-test-defer-three-days-button]');
        });

        it('defers the todo by three days', function (assert) {
          assert.ok(todo.deferUntilDate.calledOnce, 'deferUntilDate called'); // TODO test argument
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      describe('by a week', function (hooks) {
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
          await click('[data-test-defer-one-week-button]');
        });

        it('defers the todo by one week', function (assert) {
          assert.ok(todo.deferUntilDate.calledOnce, 'deferUntilDate called'); // TODO test argument
          assert.ok(todo.save.calledOnce, 'save called');
        });
      });

      describe('until a chosen date', function () {
        const dateString = '2030-01-01';

        describe('cancelling', function (hooks) {
          hooks.beforeEach(async function () {
            this.set('todo', {});
            await render(hbs`<TodoDetail @todo={{todo}} />`);

            await click('[data-test-defer-button]');
            await click('[data-test-defer-until-date-button]');
            await click('[data-test-cancel-defer-until-date-button]');
          });

          it('hides the defer options', function (assert) {
            assert.dom('[data-test-deferred-until-field]').doesNotExist();
            assert.dom('[data-test-defer-one-day-button]').doesNotExist();
          });
        });

        describe('on success', function (hooks) {
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

          it('defers the todo until the chosen date', function (assert) {
            assert.equal(
              formatDate(todo.deferUntilDate.getCall(0).args[0]),
              dateString,
              'deferred one week',
            );
            assert.ok(todo.save.calledOnce, 'save called');
          });

          it('calls onHandle', function (assert) {
            assert.ok(onHandle.calledOnce, 'calls onHandle');
          });
        });

        describe('on error', function (hooks) {
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

          it('displays an error', function (assert) {
            assert
              .dom('[data-test-error-message]')
              .hasText('An error occurred while deferring the todo.');
          });

          it('does not call onHandle', function (assert) {
            assert.ok(onHandle.notCalled, 'onHandle not called');
          });
        });
      });
    });
  });

  describe('future todo', function () {
    it('displays todo info', async function (assert) {
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

  describe('completed todo', function () {
    it('displays todo info', async function (assert) {
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

    describe('uncompleting', function () {
      describe('on success', function (hooks) {
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

        it('marks the todo saved', function (assert) {
          assert.equal(todo.completedAt, null, 'completed date set to null');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        it('hides the completed date from the rendered component', async function (assert) {
          // ideally we would test that the component goes to an uncompleted
          // state, but this relies on computed model properties we aren't
          // integrating with. instead, we just test that the date is not
          // included in the completed-at area
          assert.dom('[data-test-completed-at]').hasText('Completed');
        });

        it('does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'does not call onHandle');
        });
      });

      describe('on error', function (hooks) {
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

        it('displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while uncompleting the todo.');
        });
      });
    });
  });

  describe('deleted todo', function () {
    it('displays todo info', async function (assert) {
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

    describe('undeleting', function () {
      describe('on success', function (hooks) {
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

        it('marks the todo undeleted', function (assert) {
          assert.equal(todo.deletedAt, null, 'deleted date set to null');
          assert.ok(todo.save.calledOnce, 'save called');
        });

        it('hides the deleted date from the rendered component', async function (assert) {
          assert.dom('[data-test-deleted-at]').hasText('Deleted');
        });

        it('does not call onHandle', function (assert) {
          assert.ok(onHandle.notCalled, 'onHandle not called');
        });
      });

      describe('on error', function (hooks) {
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

        it('displays an error', function (assert) {
          assert
            .dom('[data-test-error-message]')
            .hasText('An error occurred while undeleting the todo.');
        });
      });
    });
  });

  describe('editing', function () {
    describe('on cancel', function (hooks) {
      hooks.beforeEach(async function () {
        this.set('todo', {});
        await render(hbs`<TodoDetail @todo={{todo}} />`);

        await click('[data-test-edit-button]');
        await click('[data-test-cancel-edit-button]');
      });

      it('hides the edit form', async function (assert) {
        assert.dom('[data-test-todo-name-field]').doesNotExist();
      });
    });

    describe('on success', function (hooks) {
      const newName = 'New Name';
      const newDeferDate = '2030-01-01';
      const newNotes = 'New Notes';

      let todo;
      let onHandle;

      hooks.beforeEach(async function () {
        todo = {
          id: 1,
          name: 'Old Name',
          notes: 'Old Notes',
          deferUntilDate: sinon.spy(),
          save: sinon.stub().resolves(),
        };
        onHandle = sinon.spy();

        this.set('todo', todo);
        this.set('onHandle', onHandle);
        await render(hbs`<TodoDetail @todo={{todo}} @onHandle={{onHandle}} />`);

        await click('[data-test-edit-button]');
        await fillIn('[data-test-todo-name-field] textarea', newName);
        await fillIn('[data-test-deferred-until-field] input', newDeferDate);
        await fillIn('[data-test-notes-field] textarea', newNotes);
        await triggerEvent('[data-test-todo-edit-form]', 'submit');
      });

      it('saves the todo', async function (assert) {
        assert.equal(todo.name, newName, 'set name');
        assert.equal(todo.notes, newNotes, 'set notes');
        assert.equal(
          formatDate(todo.deferUntilDate.getCall(0).args[0]),
          newDeferDate,
          'deferred one week',
        );
        assert.ok(todo.save.calledOnce, 'save called');
      });

      it('hides the edit form', async function (assert) {
        assert.dom('[data-test-todo-name-field]').doesNotExist();
      });

      it('does not call onHandle', function (assert) {
        assert.equal(onHandle.callCount, 0, 'does not call onHandle');
      });
    });

    describe('on error', function (hooks) {
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

      it('displays an error', function (assert) {
        assert
          .dom('[data-test-error-message]')
          .hasText('An error occurred saving the todo.');
      });
    });
  });
});
