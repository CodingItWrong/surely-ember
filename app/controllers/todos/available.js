import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableController extends Controller {
  @service router;

  @action
  goToList() {
    this.router.transitionTo('todos.available.data');
  }
}
