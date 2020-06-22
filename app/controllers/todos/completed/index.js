import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class TodosCompleteIndexController extends Controller {
  @service router;

  sortPropertiesMostRecentlyCompleted = Object.freeze(['completedAt:desc']);

  @computed('model.@each.isCompleted', function () {
    return this.model.filter(todo => todo.isCompleted);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesMostRecentlyCompleted')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.completed.detail', todo.id);
  }

  @action
  refreshModel() {
    this.send('refreshRoute');
  }
}
