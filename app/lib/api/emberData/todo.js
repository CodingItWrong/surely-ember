const MODEL_NAME = 'todo';

export default class EmberDataTodoApi {
  constructor(store) {
    this.store = store;
  }

  getAvailable() {
    return this.store.query(MODEL_NAME, {
      filter: { status: 'available,tomorrow' },
      include: 'category',
    });
  }
}
