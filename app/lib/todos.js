import EmberDataTodoAPI from './api/emberData/todo';
import EmberDataTodoCache from './cache/emberData/todo';
import { groupTodosByCategorySorted } from './utils';

function status(todo) {
  if (todo.deletedAt) {
    return Todos.STATUS.DELETED;
  } else if (todo.completedAt) {
    return Todos.STATUS.COMPLETED;
  } else if (todo.deferredUntil > new Date()) {
    return Todos.STATUS.FUTURE;
  } else {
    return Todos.STATUS.AVAILABLE;
  }
}

export default class Todos {
  static STATUS = {
    AVAILABLE: 'available',
    COMPLETED: 'completed',
    DELETED: 'deleted',
    FUTURE: 'future',
  };

  static forStore(store) {
    return new Todos({
      api: new EmberDataTodoAPI(store),
      cache: new EmberDataTodoCache(store),
    });
  }

  constructor({ api, cache }) {
    this.api = api;
    this.cache = cache;
  }

  async loadAvailable() {
    this.cache.clear();
    const records = await this.api.getAvailable();
    this.cache.storeAll(records);
  }

  get all() {
    return this.cache.all;
  }

  get available() {
    return this.all.filter(todo => status(todo) === Todos.STATUS.AVAILABLE);
  }

  get availableGroups() {
    return groupTodosByCategorySorted(this.available);
  }
}
