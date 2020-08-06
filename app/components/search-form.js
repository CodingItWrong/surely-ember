import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SearchFormComponent extends Component {
  searchText = '';

  @action
  handleSearch() {
    this.args.onSearch(this.searchText);
  }
}
