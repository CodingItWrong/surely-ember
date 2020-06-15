import Route from '@ember/routing/route';

export default class TodosAvailableRoute extends Route {
  model() {
    return this.store.findAll('todo');
  }
}
