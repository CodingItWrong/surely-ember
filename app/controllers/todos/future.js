import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';

export default class TodosFutureController extends Controller {
  @filter('model', function (todo) {
    const now = new Date();
    console.log({ todo, deferredUntil: todo.deferredUntil });
    return (
      !todo.completedAt &&
      !todo.deletedAt &&
      todo.deferredUntil &&
      todo.deferredUntil > now
    );
  })
  filteredTodos;
}
