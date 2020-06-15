import Route from '@ember/routing/route';

export default class TodosFutureRoute extends Route {
  model() {
    return this.store.findAll('todo');
  }
}
