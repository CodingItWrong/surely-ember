import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TodosAvailableDataRoute extends Route {
  @service todos;
  @service sidebarCounts;

  async model() {
    const oldTodos = this.todos.all;
    return this.sidebarCounts.freezeDuring(oldTodos, async () => {
      await this.todos.loadAvailable();
      return this.todos.all;
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
