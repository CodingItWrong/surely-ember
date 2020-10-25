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

    describe('when there is one todo not in a category', () => {
      it('puts the todo into a "No Category" group', () => {
        const records = [{ id: 1, category: null }];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([
          {
            name: 'No Category',
            todos: records,
          },
        ]);
      });
    });

    describe('when there is one todo in a category', () => {
      it('puts the todo into a group for that category', () => {
        const categoryName = 'My Category';
        const records = [
          {
            id: 1,
            category: { name: categoryName },
          },
        ];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([
          {
            name: categoryName,
            todos: records,
          },
        ]);
      });
    });

    describe('when there are two todos in a category', () => {
      it('puts both todos in the group for that category', () => {
        const categoryName = 'My Category';
        const records = [
          {
            id: 1,
            category: { name: categoryName },
          },
          {
            id: 2,
            category: { name: categoryName },
          },
        ];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([
          {
            name: categoryName,
            todos: records,
          },
        ]);
      });
    });

    describe('when there are todos in different categories', () => {
      it('puts both the todos in separate groups for each category', () => {
        const category1Name = 'Category 1';
        const category2Name = 'Category 2';

        const category1Record = {
          id: 1,
          category: { name: category1Name },
        };
        const category2Record = {
          id: 2,
          category: { name: category2Name },
        };
        const noCategoryRecord = {
          id: 2,
          category: null,
        };

        const records = [category1Record, category2Record, noCategoryRecord];

        const todos = new Todos({ cache: cacheForRecords(records) });
        const groups = todos.availableGroups;

        expect(groups).toEqual([
          {
            name: category1Name,
            todos: [category1Record],
          },
          {
            name: category2Name,
            todos: [category2Record],
          },
          {
            name: 'No Category',
            todos: [noCategoryRecord],
          },
        ]);
      });
    });
  });
});
