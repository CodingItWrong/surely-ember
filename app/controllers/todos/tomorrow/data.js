import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { scrollToTop } from 'surely/utils';

export default class TodosTomorrowDataController extends Controller {
  @service router;

  sortPropertiesName = Object.freeze(['name:asc']);

  @computed('model.@each.isTomorrow', function () {
    return this.model.filter(todo => todo.isTomorrow);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesName')
  sortedTodos;

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
