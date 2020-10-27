import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Todos from 'surely/lib/todos';

const EMBER_DATA_LIVE_RECORDS = true;

export default class TodosService extends Service {
  @service store;

  @tracked _all = A([]);

  get todos() {
    if (!this._todos) {
      this._todos = Todos.forStore(this.store);
    }
    return this._todos;
  }

  async loadAvailable() {
    await this.todos.loadAvailable();
    this._refreshAll();
  }

  async create(attrs) {
    const record = await this.todos.create(attrs);
    this._refreshAll();
    return record;
  }

  _refreshAll() {
    if (!EMBER_DATA_LIVE_RECORDS) {
      this._all.setObjects(this.todos.all);
    }
  }

  get all() {
    if (EMBER_DATA_LIVE_RECORDS) {
      return this.todos.all;
    } else {
      return this._all;
    }
  }
}
