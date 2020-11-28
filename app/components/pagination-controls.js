import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class PaginationControlsComponent extends Component {
  get anyPages() {
    return this.args.totalPages > 0;
  }

  get isFirstPage() {
    return this.args.pageNumber === 1;
  }

  get isLastPage() {
    return this.args.pageNumber >= this.args.totalPages;
  }

  @action
  goToNextPage(e) {
    e.preventDefault();
    this.args.nextPage();
  }

  @action
  goToPrevPage(e) {
    e.preventDefault();
    this.args.prevPage();
  }
}
