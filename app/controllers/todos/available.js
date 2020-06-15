import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';

export default class TodosAvailableController extends Controller {
  sortProperties = Object.freeze(['name:asc']);

  @filter('model', function (todo) {
    return todo.isAvailable;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortProperties')
  sortedTodos;
}
