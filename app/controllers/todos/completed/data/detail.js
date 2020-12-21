import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import sortBy from 'lodash-es/sortBy';

export default class TodosCompletedDataDetailController extends Controller {
  @service router;

  get sortedCategories() {
    return sortBy(this.model.categories.toArray(), ['sortOrder', 'name']);
  }

  @action
  goToCompleted() {
    this.router.transitionTo('todos.completed');
  }
}
