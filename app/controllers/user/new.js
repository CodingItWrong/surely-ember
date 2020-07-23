import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UserNewController extends Controller {
  @service router;

  @action goToLogin() {
    this.router.transitionTo('index');
  }
}
