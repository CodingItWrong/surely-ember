import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import EmberDataTodoAPI from './api/emberData/todo';
import EmberDataTodoCache from './cache/emberData/todo';

export class Todos {
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
}

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

export function availableTodoGroups(todos) {
  const availableTodos = todos.filter(
    todo => status(todo) === Todos.STATUS.AVAILABLE,
  );
  const groupsObject = groupBy(availableTodos, todo => todo.category?.name);
  const groups = Object.entries(groupsObject).map(([, todos]) => ({
    name: todos[0].category?.name ?? 'No Category',
    todos: sortBy(todos, 'name'),
  }));
  const sortedGroups = sortBy(
    groups,
    group => group.todos[0].category?.sortOrder ?? -9999,
  );
  return sortedGroups;
}

export default Todos;
