import Route from '@ember/routing/route';

export default class TodosCompletedIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'completed' },
    });
    return this.store.peekAll('todo');
  }
}
