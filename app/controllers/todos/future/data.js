import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import groupBy from 'lodash-es/groupBy';
import sortBy from 'lodash-es/sortBy';
import { capitalizeFn } from 'surely/helpers/capitalize';
import { relativeDateFn } from 'surely/helpers/relative-date';
import { scrollToTop } from 'surely/utils';

const includesCaseInsensitive = (haystack, needle) => {
  haystack = (haystack || '').toLowerCase();
  needle = (needle || '').toLowerCase();
  return haystack.includes(needle);
};

export default class TodosFutureDataController extends Controller {
  @service router;

  @tracked searchText = '';

  get isSearching() {
    return !!this.searchText;
  }

  get filteredTodos() {
    return this.model.filter(todo => {
      const matchesSearch = includesCaseInsensitive(todo.name, this.searchText);
      return todo.isFuture && matchesSearch;
    });
  }

  get sortedTodos() {
    return sortBy(this.filteredTodos, ['deferredUntil', 'name']);
  }

  get todoGroups() {
    const groupsObject = groupBy(this.sortedTodos, 'deferredUntil');
    return Object.entries(groupsObject).map(([, todos]) => {
      return {
        name: capitalizeFn(relativeDateFn(todos[0].deferredUntil)),
        todos,
      };
    });
  }

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
