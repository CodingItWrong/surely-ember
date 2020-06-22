import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosFutureIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'future' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refreshRoute() {
    this.refresh();
  }
}
