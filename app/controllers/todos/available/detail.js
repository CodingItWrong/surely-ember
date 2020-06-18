import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableDetailController extends Controller {
  @service router;

  @action
  goToAvailable() {
    this.router.transitionTo('todos.available');
  }
}
