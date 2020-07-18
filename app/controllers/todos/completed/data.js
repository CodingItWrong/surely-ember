import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { scrollToTop } from 'surely/utils';

export default class TodosCompleteDataController extends Controller {
  @service router;

  sortPropertiesMostRecentlyCompleted = Object.freeze(['completedAt:desc']);

  @computed('model.@each.isCompleted', function () {
    return this.model.filter(todo => todo.isCompleted);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyCompleted')
  sortedTodos;

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
}