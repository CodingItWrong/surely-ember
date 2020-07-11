import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class TodosTomorrowIndexController extends Controller {
  @service router;

  sortPropertiesName = Object.freeze(['name:asc']);

  @computed('model.@each.isTomorrow', function () {
    return this.model.filter(todo => todo.isTomorrow);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesName')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.tomorrow.detail', todo.id);
  }
}
