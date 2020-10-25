import groupBy from 'lodash/groupBy';
import EmberDataTodoAPI from './api/emberData/todo';
import EmberDataTodoCache from './cache/emberData/todo';

export default class Todos {
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

  get availableGroups() {
    const todos = this.all;
    const availableTodos = todos.filter(todo => todo.isAvailable);
    const groupsObject = groupBy(availableTodos, todo => todo.category?.name);
    const groups = Object.entries(groupsObject).map(([, todos]) => {
      return {
        name: todos[0].category?.name ?? 'No Category',
        todos,
      };
    });
    return groups;
  }
}
