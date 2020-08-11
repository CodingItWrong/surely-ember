import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class TodosCompletedDataRoute extends Route {
  queryParams = {
    pageNumber: {
      as: 'p',
      refreshModel: true,
    },
    searchText: {
      as: 'q',
      refreshModel: true,
    },
  };

  model({ searchText, pageNumber }) {
    return this.store.query('todo', {
      filter: { status: 'completed', search: searchText },
      sort: '-completedAt',
      page: { number: pageNumber },
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
