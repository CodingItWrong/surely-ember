import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosCompletedDetailController extends Controller {
  @service router;

  @action
  goToCompleted() {
    this.router.transitionTo('todos.completed');
  }
}
