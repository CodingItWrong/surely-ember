import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { scrollToTop } from 'surely/utils';
import groupBy from 'lodash-es/groupBy';

export default class TodosTomorrowDataController extends Controller {
  @service router;

  sortPropertiesName = Object.freeze(['name:asc']);

  @filter('model.@each.isTomorrow', function (todo) {
    return todo.isTomorrow;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesName')
  sortedTodos;

  @computed('sortedTodos.@each.deferredUntil', function () {
    const todosWithCategoryName = this.sortedTodos.map(todo => ({
      todo,
      categoryName: todo.category.get('name'),
    }));
    const groupsObject = groupBy(todosWithCategoryName, 'categoryName');
    return Object.entries(groupsObject).map(([, todoWrappers]) => {
      return {
        name: todoWrappers[0].categoryName ?? 'No Category',
        todos: todoWrappers.map(wrapper => wrapper.todo),
      };
    });
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
