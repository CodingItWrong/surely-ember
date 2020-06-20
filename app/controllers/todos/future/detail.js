import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosFutureDetailController extends Controller {
  @service router;

  @action
  goToFuture() {
    this.router.transitionTo('todos.future');
  }
}