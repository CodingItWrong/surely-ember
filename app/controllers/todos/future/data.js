import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import groupBy from 'lodash-es/groupBy';
import { scrollToTop } from 'surely/utils';

const includesCaseInsensitive = (haystack, needle) => {
  haystack = (haystack || '').toLowerCase();
  needle = (needle || '').toLowerCase();
  return haystack.includes(needle);
};

export default class TodosFutureDataController extends Controller {
  @service router;

  sortPropertiesDateThenName = Object.freeze(['deferredUntil:asc', 'name:asc']);

  @tracked searchText = '';

  get isSearching() {
    return !!this.searchText;
  }

  @filter('model.@each.isFuture', ['searchText'], function (todo) {
    const matchesSearch = includesCaseInsensitive(todo.name, this.searchText);
    return todo.isFuture && matchesSearch;
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
  handleSearch(searchText) {
    this.searchText = searchText;
  }

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
