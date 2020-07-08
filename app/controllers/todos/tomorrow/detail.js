import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosTomorrowDetailController extends Controller {
  @service router;

  @action
  goToTomorrow() {
    this.router.transitionTo('todos.tomorrow');
  }
}
