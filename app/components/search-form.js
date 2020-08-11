import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class SearchFormComponent extends Component {
  searchText = '';

  @action
  handleSearch() {
    this.args.onSearch(this.searchText);
  }
}
