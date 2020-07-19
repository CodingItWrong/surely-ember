import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scrollToTop } from 'surely/utils';

export default class TodosCompleteDataController extends Controller {
  @service router;

  @tracked pageNumber = 1;

  get totalPages() {
    return this.model.meta['page-count'];
  }

  // TODO change to a @filter decorator
  @computed('model.@each.isCompleted', function () {
    return this.model.filter(todo => todo.isCompleted);
  })
  filteredTodos;

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
