import Route from '@ember/routing/route';

export default class TodosDeletedIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'deleted' },
    });
    return this.store.peekAll('todo');
  }
}
