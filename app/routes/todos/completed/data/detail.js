import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class TodosCompletedDataDetailRoute extends Route {
  async model({ todo_id }) {
    return RSVP.hash({
      todo: this.store.findRecord('todo', todo_id),
      categories: this.store.findAll('category'),
    });
  }
}
