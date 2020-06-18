import Route from '@ember/routing/route';

export default class TodosCompletedIndexRoute extends Route {
  model() {
    return this.store.query('todo', {
      filter: { status: 'completed' },
    });
  }
}
