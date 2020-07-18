import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

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

    const { deferredUntil, onAdd } = this.args;
    const todo = this.store.createRecord('todo', {
      name: this.newTodoName,
      deferredUntil,
    });
    try {
      await todo.save();
      this.newTodoName = '';
      onAdd();
    } catch (e) {
      console.error(e);
      this.error = 'An error occurred adding the todo.';
    }
  }
}
