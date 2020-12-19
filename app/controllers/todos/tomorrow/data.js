import Controller from '@ember/controller';
// reactivity doesn't work on these Ember Data models without @computed
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import sortBy from 'lodash-es/sortBy';
import { groupTodosByCategorySorted, scrollToTop } from 'surely/utils';

export default class TodosTomorrowDataController extends Controller {
  @service router;

  @computed('model.@each.isTomorrow')
  get filteredTodos() {
    return this.model.filter(todo => todo.isTomorrow);
  }

  get sortedTodos() {
    return sortBy(this.filteredTodos, ['name']);
  }

  get todoGroups() {
    return groupTodosByCategorySorted(this.sortedTodos);
  }

  @action
  goToList() {
    this.router.transitionTo('todos.tomorrow.data');
  }

  @action
  handleChooseTodo(todo) {
    this.router.transitionTo('todos.tomorrow.data.detail', todo.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }
}
