import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CategoriesDataDetailController extends Controller {
  @service router;

  @action
  goToCategories() {
    this.router.transitionTo('categories');
  }
}
