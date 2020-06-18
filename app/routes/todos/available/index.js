import Route from '@ember/routing/route';

export default class TodosAvailableIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'available' },
    });
    return this.store.peekAll('todo');
  }
}
