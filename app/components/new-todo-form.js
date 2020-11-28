import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { logRuntimeError } from 'surely/utils';

const ENTER_KEY_CODE = 13;

export default class NewTodoFormComponent extends Component {
  @service todos;

  @tracked newTodoName;
  @tracked error = null;

  @action
  async createTodo(e) {
    e.preventDefault();
    this.error = null;

    const { handleCreate, deferredUntil } = this.args;
    try {
      const response = await this.todos.create({
        name: this.newTodoName,
        deferredUntil,
      });

      if (response.success) {
        handleCreate();
        this.newTodoName = '';
      } else {
        this.error = response.errors.name;
      }
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
