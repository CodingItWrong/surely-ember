import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosAvailableController extends Controller {
  @filter('model', function (todo) {
    const now = new Date();
    return (
      !todo.completedAt &&
      !todo.deletedAt &&
      (!todo.deferredUntil || todo.deferredUntil <= now)
    );
  })
  filteredTodos;
}
