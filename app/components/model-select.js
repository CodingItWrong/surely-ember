import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ModelSelectComponent extends Component {
  @action
  handleChange(e) {
    const { options, onChange } = this.args;

    const id = e.target.value;
    const model = options.find(option => option.id === id) ?? null;

    onChange(model);
  }
}
