import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class AppSideNavContentComponent extends Component {
  @service session;
  @service router;

  @action
  goToTodos(subroute) {
    this.router.transitionTo(['todos', subroute].join('.'));
  }

  @action
  goToCategories() {
    this.router.transitionTo('categories');
  }

  @action
  refreshApp() {
    window.location.reload();
  }
}
