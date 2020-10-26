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

  async create(attrs) {
    const record = this.store.createRecord(MODEL_NAME, attrs);
    await record.save();
    return record;
  }
}
