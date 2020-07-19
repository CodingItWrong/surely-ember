import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosDeletedDataRoute extends Route {
  queryParams = {
    pageNumber: {
      as: 'p',
      refreshModel: true,
    },
  };

  model({ pageNumber }) {
    return this.store.query('todo', {
      filter: { status: 'deleted' },
      sort: '-deletedAt',
      page: { number: pageNumber },
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
