import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CategoriesDataNewController extends Controller {
  @service router;

  @action
  goToCategories() {
    this.router.transitionTo('categories.data');
  }
}
