import Route from '@ember/routing/route';

export default class TodosFutureIndexRoute extends Route {
  model() {
    return this.store.findAll('todo');
  }
}
