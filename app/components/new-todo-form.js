import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { logRuntimeError } from 'surely/utils';

const ENTER_KEY_CODE = 13;

export default class NewTodoFormComponent extends Component {
  @service store;

  @tracked newTodoName;
  @tracked error = null;

  @action
  async createTodo() {
    this.error = null;

    if (!this.newTodoName) {
      this.error = 'Please enter a todo.';
      return;
    }

    const { handleCreate, deferredUntil } = this.args;
    try {
      const todo = this.store.createRecord('todo', {
        name: this.newTodoName,
        deferredUntil,
      });
      await todo.save();
      handleCreate();
      this.newTodoName = '';
    } catch (e) {
      logRuntimeError(e);
      this.error = 'An error occurred adding the todo.';
    }
  }

  @action
  handleNameKeyDown(e) {
    if (e.keyCode === ENTER_KEY_CODE) {
      this.createTodo();
      return false;
    }
    return true;
  }
}
