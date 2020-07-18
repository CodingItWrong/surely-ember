import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import groupBy from 'lodash-es/groupBy';
import { scrollToTop } from 'surely/utils';

export default class TodosFutureDataController extends Controller {
  @service router;

  sortPropertiesDateThenName = Object.freeze(['deferredUntil:asc', 'name:asc']);

  @computed('model.@each.isFuture', function () {
    return this.model.filter(todo => todo.isFuture);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesDateThenName')
  sortedTodos;

  @computed('sortedTodos.@each.deferredUntil', function () {
    const groupsObject = groupBy(this.sortedTodos, 'deferredUntil');
    return Object.entries(groupsObject).map(([, todos]) => {
      return {
        date: todos[0].deferredUntil,
        todos,
      };
    });
  })
  todoGroups;

  @action
  goToList() {
    this.router.transitionTo('todos.future.data');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.future.data.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }
}
