import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import sortBy from 'lodash-es/sortBy';

export default class TodosAvailableDataDetailController extends Controller {
  @service router;

  get sortedCategories() {
    return sortBy(this.model.categories, ['sortOrder', 'name']);
  }

  @action
  goToAvailable() {
    this.router.transitionTo('todos.available');
  }
}
