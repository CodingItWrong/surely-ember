import Controller from '@ember/controller';
import { action } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class TodosAvailableDataDetailController extends Controller {
  @service router;

  sortPropertiesAlphabetical = Object.freeze(['name:asc']);

  @sort('model.categories', 'sortPropertiesAlphabetical')
  sortedCategories;

  @action
  goToAvailable() {
    this.router.transitionTo('todos.available');
  }
}
