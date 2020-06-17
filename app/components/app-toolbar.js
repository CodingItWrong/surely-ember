import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AppToolbarComponent extends Component {
  @service router;

  @action
  goHome() {
    this.router.transitionTo('/');
  }
}
