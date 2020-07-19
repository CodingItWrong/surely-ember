import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class TodosCompletedDataRoute extends Route {
  queryParams = {
    pageNumber: {
      as: 'p',
      refreshModel: true,
    },
  };

  model({ pageNumber }) {
    return this.store.query('todo', {
      filter: { status: 'completed' },
      sort: '-completedAt',
      page: { number: pageNumber },
    });
  }

  @action
  refresh() {
    super.refresh();
  }
}
