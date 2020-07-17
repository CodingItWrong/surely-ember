import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class LayoutComponent extends Component {
  @tracked sideNavOpen = false;
}
