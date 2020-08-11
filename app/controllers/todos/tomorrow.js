import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
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
