import Controller from '@ember/controller';
import { action } from '@ember/object';
import { filter } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { scrollToTop } from 'surely/utils';

export default class TodosCompleteDataController extends Controller {
  @service router;

  @tracked pageNumber = 1;
  @tracked searchText = '';

  get isSearching() {
    return !!this.searchText;
  }

  get totalPages() {
    return this.model.meta['page-count'];
  }

  @filter('model.@each.isCompleted', function (todo) {
    return todo.isCompleted;
  })
  filteredTodos;

  @action
  handleSearch(searchText) {
    this.searchText = searchText;
  }

  @action
  goToList() {
    this.router.transitionTo('todos.completed.data');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.completed.data.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }

  @action
  nextPage() {
    this.pageNumber += 1;
    scrollToTop();
  }

  @action
  prevPage() {
    this.pageNumber -= 1;
    scrollToTop();
  }
}
