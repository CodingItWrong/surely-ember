import Route from '@ember/routing/route';

export default class TodosAvailableIndexRoute extends Route {
  model() {
    return this.store.query('todo', {
      filter: { status: 'available' },
    });
  }
}
