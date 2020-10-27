// TODO: once all updates go through Todos, disable this feature flag to
// decouple reactivity from Ember Data, so alternate libraries can be used.
const EMBER_DATA_LIVE_RECORDS = true;

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
    const liveRecords = this._store.peekAll('todo');

    if (EMBER_DATA_LIVE_RECORDS) {
      return liveRecords;
    } else {
      return liveRecords.toArray();
    }
  }
}
