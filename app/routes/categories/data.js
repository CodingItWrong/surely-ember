import Route from '@ember/routing/route';

export default class CategoriesDataRoute extends Route {
  model() {
    return this.store.findAll('category');
  }
}
