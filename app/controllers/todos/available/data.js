import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { Todos, availableTodoGroups } from 'surely/lib/todos';
import { scrollToTop } from 'surely/utils';

export default class TodosAvailableDataController extends Controller {
  @service router;

  @computed('model.@each.{id,isAvailable,name,category}', 'store', function () {
    const todos = Todos.forStore(this.store);
    return availableTodoGroups(todos.all);
  })
  todoGroups;

  @action
  goToList() {
    this.router.transitionTo('todos.available.data');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.available.data.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }
}
