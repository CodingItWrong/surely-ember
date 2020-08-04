import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AppSideNavContentComponent extends Component {
  @service session;
  @service router;

  @action
  goToTodos(subroute) {
    this.router.transitionTo(['todos', subroute].join('.'));
  }

  @action
  refreshApp() {
    window.location.reload();
  }
}
