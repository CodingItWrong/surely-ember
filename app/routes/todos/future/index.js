import Route from '@ember/routing/route';

export default class TodosFutureIndexRoute extends Route {
  model() {
    return this.store.query('todo', {
      filter: { status: 'future' },
    });
  }
}
