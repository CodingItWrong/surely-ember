export default class EmberDataTodoCache {
  constructor(store) {
    this._store = store;
  }

  store(/* record */) {
    // NO-OP
  }

  storeAll(/* records */) {
    // NO-OP
  }

  clear() {
    this._store.unloadAll();
  }

  get all() {
    return this._store.peekAll('todo');
  }
}
