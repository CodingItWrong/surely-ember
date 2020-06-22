import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosDeletedIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'deleted' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refreshModel() {
    this.refresh();
  }
}
