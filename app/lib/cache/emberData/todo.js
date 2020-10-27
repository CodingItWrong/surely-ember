const EMBER_DATA_LIVE_RECORDS = false;

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
