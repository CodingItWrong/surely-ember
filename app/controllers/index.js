import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service router;

  @action
  goToAvailable() {
    this.router.transitionTo('todos.available');
  }

  @action
  goToFuture() {
    this.router.transitionTo('todos.future');
  }
}
