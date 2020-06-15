import Controller from '@ember/controller';
import { filter } from '@ember/object/computed';
import parse from 'date-fns/parse';

const parseFormatString = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

export default class TodosAvailableController extends Controller {
  @filter('model', function (todo) {
    const now = new Date();
    console.log({
      now,
      name: todo.name,
      deferredUntil: todo.deferredUntil,
    });
    return (
      !todo.completedAt &&
      !todo.deletedAt &&
      (!todo.deferredUntil ||
        parse(todo.deferredUntil, parseFormatString, new Date()) <= now)
    );
  })
  filteredTodos;
}
