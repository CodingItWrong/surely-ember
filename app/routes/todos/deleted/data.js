import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosDeletedDataRoute extends Route {
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
      filter: { status: 'deleted', search: searchText },
      sort: '-deletedAt',
      page: { number: pageNumber },
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
