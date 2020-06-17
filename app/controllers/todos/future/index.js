import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TodosFutureIndexController extends Controller {
  @service router;

  sortPropertiesDeferredUntil = Object.freeze(['deferredUntil:asc']);

  @filter('model', function (todo) {
    return todo.isFuture;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesDeferredUntil')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.future.detail', todo.id);
  }
}
