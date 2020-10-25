import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Todos from 'surely/lib/todos';
import { scrollToTop } from 'surely/utils';

export default class TodosAvailableDataController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @filter('model.@each.{id,isAvailable}', function (todo) {
    return todo.id && todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @computed('model.@each.{id,isAvailable,name,category}', 'store', function () {
    const todos = Todos.forStore(this.store);
    return todos.availableGroups;
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
