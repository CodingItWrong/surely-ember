import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosFutureDataRoute extends Route {
  @service sidebarCounts;

  async model() {
    const oldTodos = this.store.peekAll('todo');
    return this.sidebarCounts.freezeDuring(oldTodos, async () => {
      this.store.unloadAll('todo');
      await this.store.query('todo', {
        filter: { status: 'available,future' },
      });
      return this.store.peekAll('todo');
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
