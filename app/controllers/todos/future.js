import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosFutureController extends Controller {
  @filter('model', function (todo) {
    return todo.isFuture;
  })
  filteredTodos;
}
