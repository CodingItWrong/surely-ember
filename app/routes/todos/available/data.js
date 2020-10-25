import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Todos from 'surely/lib/todos';

export default class TodosAvailableDataRoute extends Route {
  @service sidebarCounts;

  async model() {
    const todos = Todos.forStore(this.store);
    const oldTodos = todos.all;
    return this.sidebarCounts.freezeDuring(oldTodos, async () => {
      await todos.loadAvailable();
      return todos.all;
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
