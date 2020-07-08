import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosTomorrowIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { deferredUntil: 'tomorrow' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refresh() {
    super.refresh();
  }
}
