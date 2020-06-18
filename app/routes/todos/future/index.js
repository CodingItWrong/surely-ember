import Route from '@ember/routing/route';

export default class TodosFutureIndexRoute extends Route {
  async model() {
    await this.store.query('todo', {
      filter: { status: 'future' },
    });
    return this.store.peekAll('todo');
  }
}
