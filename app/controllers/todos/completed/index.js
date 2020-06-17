import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TodosCompleteIndexController extends Controller {
  @service router;

  sortPropertiesMostRecentlyCompleted = Object.freeze(['completedAt:desc']);

  @filter('model', function (todo) {
    return todo.isCompleted;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyCompleted')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.completed.detail', todo.id);
  }
}
