import Controller from '@ember/controller';
import { sort, filter } from '@ember/object/computed';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { scrollToTop } from 'surely/utils';
import groupBy from 'lodash-es/groupBy';
import sortBy from 'lodash-es/sortBy';

export default class TodosAvailableDataController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @filter('model.@each.{id,isAvailable}', function (todo) {
    return todo.id && todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @computed('sortedTodos.@each.deferredUntil', function () {
    const todosWithCategoryName = this.sortedTodos.map(todo => ({
      todo,
      categoryName: todo.category.get('name'),
    }));
    const groupsObject = groupBy(todosWithCategoryName, 'categoryName');
    const groups = Object.entries(groupsObject).map(([, todoWrappers]) => {
      return {
        name: todoWrappers[0].categoryName ?? 'No Category',
        todos: todoWrappers.map(wrapper => wrapper.todo),
      };
    });
    const sortedGroups = sortBy(groups, group =>
      group.todos[0].category?.get('sortOrder'),
    );
    return sortedGroups;
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
