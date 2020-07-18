import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TodosTomorrowController extends Controller {
  @service router;

  @action
  goToList() {
    this.router.transitionTo('todos.tomorrow.data');
  }
}
