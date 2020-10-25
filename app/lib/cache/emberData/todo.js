export default class EmberDataTodoCache {
  constructor(store) {
    this.store = store;
  }

  storeAll(/* records */) {
    // NO-OP
  }

  clear() {
    this.store.unloadAll();
  }

  get all() {
    return this.store.peekAll('todo');
  }
}
