import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosCompletedController extends Controller {
  @filter('model', function (todo) {
    return todo.isCompleted;
  })
  filteredTodos;
}
