import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosAvailableIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'available' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refresh() {
    super.refresh();
  }
}
