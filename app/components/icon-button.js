import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class IconButtonComponent extends Component {
  @action
  handleClick() {
    const { onClick } = this.args;
    if (onClick) {
      onClick();
    }
  }
}
