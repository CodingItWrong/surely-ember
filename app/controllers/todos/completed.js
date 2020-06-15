import Controller from '@ember/controller';
import { filter, sort } from '@ember/object/computed';

export default class TodosCompletedController extends Controller {
  sortPropertiesMostRecentlyCompleted = Object.freeze(['completedAt:desc']);

  @filter('model', function (todo) {
    return todo.isCompleted;
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyCompleted')
  sortedTodos;
}
