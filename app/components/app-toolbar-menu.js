import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class AppToolbarMenuComponent extends Component {
  @service router;
  @service session;

  @action
  signOut() {
    this.session.invalidate();
    this.router.transitionTo('/');
  }
}
