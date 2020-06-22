import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class TodosFutureIndexController extends Controller {
  @service router;

  sortPropertiesDeferredUntil = Object.freeze(['deferredUntil:asc']);

  @computed('model.@each.isFuture', function () {
    return this.model.filter(todo => todo.isFuture);
  })
  filteredTodos;

  @sort('filteredTodos', 'sortPropertiesDeferredUntil')
  sortedTodos;

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.future.detail', todo.id);
  }

  @action
  refreshModel() {
    this.send('refreshRoute');
  }
}
