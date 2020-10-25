import addDays from 'date-fns/addDays';
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

  describe('get available', () => {
    it('includes an available todo', () => {
      const records = [{ id: 1 }];
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.available).toEqual(records);
    });

    it('includes a todo deferred until the past', () => {
      const now = new Date();
      const past = addDays(now, -1);
      const records = [{ id: 1, deferredUntil: past }];
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.available).toEqual(records);
    });

    it('does not include a deleted todo', () => {
      const records = [{ id: 1, deletedAt: new Date() }];
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.available).toEqual([]);
    });

    it('does not include a completed todo', () => {
      const records = [{ id: 1, completedAt: new Date() }];
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.available).toEqual([]);
    });

    it('does not include a deferred todo', () => {
      const now = new Date();
      const future = addDays(now, 1);
      const records = [{ id: 1, deferredUntil: future }];
      cache = {
        get all() {
          return records;
        },
      };
      todos = new Todos({ cache });
      expect(todos.available).toEqual([]);
    });
  });

  describe('get availableGroups', () => {
    const past = addDays(new Date(), -1);
    const cacheForRecords = records => ({
      get all() {
        return records;
      },
    });

    describe('when there is an available todo and a non-available todo', () => {
      it('only returns the available todo', () => {
        const availableTodo = { id: 1 };
        const nonAvailableTodo = { id: 2, completedAt: past };
        const records = [availableTodo, nonAvailableTodo];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups[0].todos).toEqual([availableTodo]);
      });
    });

    describe('when there are todos in different categories', () => {
      it('puts both the todos in separate groups for each category', () => {
        const category1Name = 'Category 1';
        const category2Name = 'Category 2';

        const category1 = {
          name: category1Name,
          sortOrder: 2,
        };
        const category2 = {
          name: category2Name,
          sortOrder: 1,
        };

        const category1Record = {
          id: 1,
          category: category1,
        };
        const category2Record = {
          id: 2,
          category: category2,
        };
        const noCategoryRecord = {
          id: 3,
          category: null,
        };

        const records = [category2Record, category1Record, noCategoryRecord];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([
          {
            name: 'No Category',
            todos: [noCategoryRecord],
          },
          {
            name: category2Name,
            todos: [category2Record],
          },
          {
            name: category1Name,
            todos: [category1Record],
          },
        ]);
      });
    });
  });
});
