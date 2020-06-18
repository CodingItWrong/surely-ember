import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

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
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.deleted.detail', todo.id);
  }
}
