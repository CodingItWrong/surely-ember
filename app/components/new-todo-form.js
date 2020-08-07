import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { logRuntimeError } from 'surely/utils';

export default class NewTodoFormComponent extends Component {
  @tracked newTodoName;
  @tracked error = null;

  @action
  async createTodo() {
    this.error = null;

    if (!this.newTodoName) {
      this.error = 'Please enter a todo.';
      return;
    }

    const { handleCreate } = this.args;
    try {
      await handleCreate(this.newTodoName);
      this.newTodoName = '';
    } catch (e) {
      logRuntimeError(e);
      this.error = 'An error occurred adding the todo.';
    }
  }
}
