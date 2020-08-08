import Controller from '@ember/controller';
import { action } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class TodosTomorrowDataDetailController extends Controller {
  @service router;

  sortPropertiesSortOrderField = Object.freeze(['sortOrder:asc,name:asc']);

  @sort('model.categories', 'sortPropertiesSortOrderField')
  sortedCategories;

  @action
  goToTomorrow() {
    this.router.transitionTo('todos.tomorrow');
  }
}
