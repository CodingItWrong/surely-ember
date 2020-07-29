import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;

  async model() {
    if (this.session.isAuthenticated) {
      await this.store.query('todo', {
        filter: { status: 'available,tomorrow' },
      });
      return this.store.peekAll('todo');
    } else {
      return [];
    }
  }
}
