import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';

export default class TodosFutureController extends Controller {
  sortProperties = Object.freeze(['deferredUntil:asc']);

  @filter('model', function (todo) {
    return todo.isFuture;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortProperties')
  sortedTodos;
}
