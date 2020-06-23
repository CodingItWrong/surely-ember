import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { action } from '@ember/object';
import { filter } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class TodosAvailableIndexController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @filter('model.@each.{id,isAvailable}', function (todo) {
    return todo.id && todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesAlphabetical')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.available.detail', todo.id);
  }
}
