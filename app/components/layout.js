import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LayoutComponent extends Component {
  @service session;
}
