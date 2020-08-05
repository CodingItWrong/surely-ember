import Component from '@glimmer/component';
import { action } from '@ember/object';

// hi
export default class SearchFormComponent extends Component {
  searchText = '';

  @action
  handleSearch() {
    this.args.onSearch(this.searchText);
  }
}
