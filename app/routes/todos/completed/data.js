import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosCompletedIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'completed' },
    });
    return this.store.peekAll('todo');
  }

  @action
  refresh() {
    super.refresh();
  }
}
