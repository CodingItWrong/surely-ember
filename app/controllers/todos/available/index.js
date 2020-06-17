import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableIndexController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @filter('model', function (todo) {
    return todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.available.detail', todo.id);
  }
}
