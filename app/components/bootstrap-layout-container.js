import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class BootstrapLayoutContainerComponent extends Component {
  @tracked sideNavOpen = false;
}
