import Todos from '../todos';

describe('Todos', () => {
  describe('loadAvailable', () => {
    const records = [{ id: 1 }, { id: 2 }];

    let todos;
    let api;
    let cache;
    let resolvedValue;

    beforeEach(async () => {
      api = {
        getAvailable: jest
          .fn()
          .mockName('getAvailableTodos')
          .mockResolvedValue(records),
      };
      cache = {
        storeAll: jest.fn(),
      };
      todos = new Todos({ api, cache });
      resolvedValue = await todos.loadAvailable();
    });

    it('stores todos from the API in the cache', () => {
      expect(cache.storeAll).toHaveBeenCalledWith(records);
    });

    it('does not resolve to the records', () => {
      expect(resolvedValue).not.toBeDefined();
    });
  });
});
