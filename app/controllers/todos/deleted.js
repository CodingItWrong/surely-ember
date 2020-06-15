import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosDeletedController extends Controller {
  @filter('model', function (todo) {
    return todo.isDeleted;
  })
  filteredTodos;
}
