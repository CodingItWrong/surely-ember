import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { logRuntimeError } from 'surely/utils';

export default class NewTodoFormComponent extends Component {
  @service todos;

  @tracked newTodoName;
  @tracked errorMessage = null;

  @action
  async createTodo(e) {
    e.preventDefault();
    this.errorMessage = null;

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
        this.errorMessage = response.errors.name;
      }
    } catch (e) {
      logRuntimeError(e);
      this.errorMessage = 'An error occurred adding the todo.';
    }
  }
}
