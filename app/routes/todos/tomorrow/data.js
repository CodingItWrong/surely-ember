import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosTomorrowDataRoute extends Route {
  async model() {
    this.store.unloadAll('todo');
    await this.store.query('todo', {
      filter: { status: 'available,tomorrow' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refresh() {
    super.refresh();
  }
}
