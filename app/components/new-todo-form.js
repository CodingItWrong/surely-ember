import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NewTodoFormComponent extends Component {
  @service store;

  @tracked newTodoName;

  @action
  async createTodo() {
    const todo = this.store.createRecord('todo', {
      name: this.newTodoName,
    });
    await todo.save();
    this.newTodoName = '';
  }
}
