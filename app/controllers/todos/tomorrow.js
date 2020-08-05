import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tomorrow } from 'surely/utils';

export default class TodosTomorrowController extends Controller {
  @service router;

  @action
  async handleCreate(todoName) {
    const todo = this.store.createRecord('todo', {
      name: todoName,
      deferredUntil: tomorrow(),
    });
    await todo.save();
    this.router.transitionTo('todos.tomorrow.data');
  }
}
