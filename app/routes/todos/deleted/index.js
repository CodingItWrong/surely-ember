import Route from '@ember/routing/route';

export default class TodosDeletedIndexRoute extends Route {
  model() {
    return this.store.query('todo', {
      filter: { status: 'deleted' },
    });
  }
}
