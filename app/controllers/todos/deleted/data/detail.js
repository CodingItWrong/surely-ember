import Controller from '@ember/controller';
import { action } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class TodosDeletedDataDetailController extends Controller {
  @service router;

  sortPropertiesSortOrderField = Object.freeze(['sortOrder:asc,name:asc']);

  @sort('model.categories', 'sortPropertiesSortOrderField')
  sortedCategories;

  @action
  goToDeleted() {
    this.router.transitionTo('todos.deleted');
  }
}
