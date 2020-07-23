import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AppToolbarMenuComponent extends Component {
  @service router;
  @service session;

  @action
  signOut() {
    this.session.invalidate();
    this.router.transitionTo('/');
  }
}
