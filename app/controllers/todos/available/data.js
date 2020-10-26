import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { availableTodoGroups } from 'surely/lib/todos';
import { scrollToTop } from 'surely/utils';

export default class TodosAvailableDataController extends Controller {
  @service router;

  @computed(
    'model.@each.{id,name,category,deletedAt,completedAt,deferredUntil}',
    'store',
    function () {
      return availableTodoGroups(this.model);
    },
  )
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
