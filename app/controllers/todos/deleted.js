import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { scrollToTop } from 'surely/utils';

export default class TodosDeletedIndexController extends Controller {
  @service router;

  sortPropertiesMostRecentlyDeleted = Object.freeze(['deletedAt:desc']);

  @computed('model.@each.isDeleted', function () {
    return this.model.filter(todo => todo.isDeleted);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyDeleted')
  sortedTodos;

  @action
  goToList() {
    this.router.transitionTo('todos.deleted');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.deleted.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }
}
