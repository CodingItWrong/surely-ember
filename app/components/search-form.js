import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class SearchFormComponent extends Component {
  searchText = '';

  @action
  handleSearch(e) {
    e.preventDefault();
    this.args.onSearch(this.searchText);
  }
}
