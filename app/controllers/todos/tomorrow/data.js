import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { filter } from '@ember/object/computed';
import { scrollToTop } from 'surely/utils';

export default class TodosTomorrowDataController extends Controller {
  @service router;

  sortPropertiesName = Object.freeze(['name:asc']);

  @filter('model.@each.isTomorrow', function (todo) {
    return todo.isTomorrow;
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
