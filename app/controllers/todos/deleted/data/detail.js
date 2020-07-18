import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TodosDeletedDataDetailController extends Controller {
  @service router;

  @action
  goToDeleted() {
    this.router.transitionTo('todos.deleted');
  }
}
