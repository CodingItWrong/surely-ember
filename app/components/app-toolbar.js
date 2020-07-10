import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AppToolbarComponent extends Component {
  @service router;
  @service session;

  @action
  logOut() {
    this.session.invalidate();
    this.router.transitionTo('/');
  }
}
