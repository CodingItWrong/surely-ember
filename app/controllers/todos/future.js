import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';
import parse from 'date-fns/parse';

const parseFormatString = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

export default class TodosFutureController extends Controller {
  @filter('model', function (todo) {
    const now = new Date();
    console.log({ todo, deferredUntil: todo.deferredUntil });
    // TODO: convert now to a string once, instead of parsing record date to a Date object each time
    return (
      !todo.completedAt &&
      !todo.deletedAt &&
      todo.deferredUntil &&
      parse(todo.deferredUntil, parseFormatString, new Date()) > now
    );
  })
  filteredTodos;
}
