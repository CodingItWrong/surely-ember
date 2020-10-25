import Todos from '../todos';

describe('Todos', () => {
  const records = [{ id: 1 }, { id: 2 }];

  let todos;
  let api;
  let cache;

  describe('loadAvailable', () => {
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
        clear: jest.fn(),
      };
      todos = new Todos({ api, cache });
      resolvedValue = await todos.loadAvailable();
    });

    it('clears the records from the cache', () => {
      expect(cache.clear).toHaveBeenCalledWith();
      expect(cache.clear).toHaveBeenCalledBefore(cache.storeAll);
    });

    it('stores todos from the API in the cache', () => {
      expect(cache.storeAll).toHaveBeenCalledWith(records);
    });

    it('does not resolve to the records', () => {
      expect(resolvedValue).not.toBeDefined();
    });
  });

  describe('get all', () => {
    it('returns the records from the cache', () => {
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.all).toEqual(records);
    });
  });

  describe('get availableGroups', () => {
    const cacheForRecords = records => ({
      get all() {
        return records;
      },
    });

    describe('when there are no available todos', () => {
      it('returns an empty array', () => {
        const records = [];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([]);
      });
    });
  });
});
