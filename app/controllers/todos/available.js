import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosAvailableController extends Controller {
  @filter('model', function (todo) {
    return todo.isAvailable;
  })
  filteredTodos;
}
