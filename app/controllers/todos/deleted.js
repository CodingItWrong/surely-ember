import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';

export default class TodosDeletedController extends Controller {
  sortProperties = Object.freeze(['deletedAt:desc']);

  @filter('model', function (todo) {
    return todo.isDeleted;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortProperties')
  sortedTodos;
}
