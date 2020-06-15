import Route from '@ember/routing/route';

export default class TodosCompletedRoute extends Route {
  model() {
    return this.store.findAll('todo');
  }
}
