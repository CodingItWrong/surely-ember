import Route from '@ember/routing/route';

export default class TodosDeletedRoute extends Route {
  model() {
    return this.store.findAll('todo');
  }
}
