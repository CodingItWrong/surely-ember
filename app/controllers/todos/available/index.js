import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableIndexController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @computed('model.@each.{id,isAvailable}', function () {
    return this.model.filter(todo => todo.id && todo.isAvailable);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.available.detail', todo.id);
  }

  @action
  refreshModel() {
    this.send('refreshRoute');
  }
}
