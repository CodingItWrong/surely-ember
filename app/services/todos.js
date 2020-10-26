import Service, { inject as service } from '@ember/service';
import Todos from 'surely/lib/todos';

export default class TodosService extends Service {
  @service store;

  get todos() {
    if (!this._todos) {
      this._todos = Todos.forStore(this.store);
    }
    return this._todos;
  }

  async loadAvailable() {
    this.todos.loadAvailable();
  }

  get all() {
    return this.todos.all;
  }
}
