import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TodosDeletedIndexController extends Controller {
  @service router;

  sortPropertiesMostRecentlyDeleted = Object.freeze(['deletedAt:desc']);

  @filter('model', function (todo) {
    return todo.isDeleted;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyDeleted')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.deleted.detail', todo.id);
  }
}
