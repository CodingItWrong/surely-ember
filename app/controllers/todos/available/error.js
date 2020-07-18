import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosAvailableErrorController extends Controller {
  @service router;

  @action
  handleRefresh() {
    this.router.transitionTo('todos.available.data');
  }
}
