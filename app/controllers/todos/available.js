import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableController extends Controller {
  @service router;

  @action
  handleCreate() {
    this.router.transitionTo('todos.available.data');
  }
}
