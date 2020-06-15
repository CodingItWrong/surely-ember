import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';

export default class TodosAvailableController extends Controller {
  @filter('model', function (todo) {
    return todo.isAvailable;
  })
  filteredTodos;

  sortProperties = Object.freeze(['name:asc']);

  @sort('filteredTodos', 'sortProperties')
  sortedTodos;
}
