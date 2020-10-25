export default class Todos {
  constructor({ api, cache }) {
    this.api = api;
    this.cache = cache;
  }

  async loadAvailable() {
    const records = await this.api.getAvailable();
    this.cache.storeAll(records);
  }

  get all() {
    return this.cache.all;
  }
}
