import Controller from '@ember/controller';
import { sort, filter } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { scrollToTop, groupTodosByCategorySorted } from 'surely/utils';

export default class TodosTomorrowDataController extends Controller {
  @service router;

  sortPropertiesName = Object.freeze(['name:asc']);

  @filter('model.@each.isTomorrow', function (todo) {
    return todo.isTomorrow;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesName')
  sortedTodos;

  @computed('sortedTodos.@each.{name,category}', function () {
    return groupTodosByCategorySorted(this.sortedTodos);
  })
  todoGroups;

  @action
  goToList() {
    this.router.transitionTo('todos.tomorrow.data');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.tomorrow.data.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }
}
