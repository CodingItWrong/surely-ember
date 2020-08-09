import Controller from '@ember/controller';
import { sort, filter } from '@ember/object/computed';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { scrollToTop, groupTodosByCategorySorted } from 'surely/utils';

export default class TodosAvailableDataController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @filter('model.@each.{id,isAvailable}', function (todo) {
    return todo.id && todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @computed('sortedTodos.@each.{name,category}', function () {
    return groupTodosByCategorySorted(this.sortedTodos);
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
