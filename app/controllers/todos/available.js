import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableController extends Controller {
  @service router;

  @action
  async handleCreate(todoName) {
    const todo = this.store.createRecord('todo', {
      name: todoName,
    });
    await todo.save();
    this.router.transitionTo('todos.available.data');
  }
}
