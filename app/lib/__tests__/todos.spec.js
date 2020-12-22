import addDays from 'date-fns/addDays';
import { Todos, availableTodoGroups } from '../todos';

describe('Todos', () => {
  const records = [{ id: 1 }, { id: 2 }];
  const past = addDays(new Date(), -1);

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

  describe('create', () => {
    let resolvedValue;

    describe('when invalid', () => {
      beforeEach(async () => {
        const attrs = { name: '' };
        todos = new Todos({});
        resolvedValue = await todos.create(attrs);
      });

      it('indicates failure', () => {
        expect(resolvedValue.success).toBe(false);
      });

      it('provides the validation error', () => {
        expect(resolvedValue.errors).toEqual({
          name: 'Please enter a todo.',
        });
      });
    });

    describe('when valid', () => {
      const todoName = 'Todo Name';
      const attrs = { name: todoName };
      const record = { id: 1 };

      beforeEach(async () => {
        api = {
          create: jest.fn().mockName('api.create').mockResolvedValue(record),
        };
        cache = {
          store: jest.fn().mockName('cache.store'),
        };
        todos = new Todos({ api, cache });

        resolvedValue = await todos.create(attrs);
      });

      it('calls the API to create the record', () => {
        expect(api.create).toHaveBeenCalledWith(attrs);
      });

      it('stores the returned record in the cache', () => {
        expect(cache.store).toHaveBeenCalledWith(record);
      });

      it('indicates success', () => {
        expect(resolvedValue.success).toBe(true);
      });

      it('does not return any validation errors', () => {
        expect(resolvedValue.errors).toEqual({});
      });

      it('returns the record', () => {
        expect(resolvedValue.record).toEqual(record);
      });
    });
  });

  describe('availableTodoGroups', () => {
    describe('when there are no available todos', () => {
      it('returns an empty array', () => {
        const records = [];

        const groups = availableTodoGroups(records);

        expect(groups).toEqual([]);
      });
    });

    describe('when there is one todo not in a category', () => {
      it('puts the todo into a "No Category" group', () => {
        const records = [
          {
            id: 1,
            isAvailable: true,
            category: null,
          },
        ];

        const groups = availableTodoGroups(records);

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

        const groups = availableTodoGroups(records);

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

        const groups = availableTodoGroups(records);

        expect(groups).toEqual([
          {
            name: categoryName,
            todos: records,
          },
        ]);
      });

      it('sorts the todos within the category', () => {
        const record1 = {
          id: 1,
          name: 'ZZZ',
        };
        const record2 = {
          id: 2,
          name: 'AAA',
        };
        const records = [record1, record2];

        const groups = availableTodoGroups(records);

        expect(groups[0].todos).toEqual([record2, record1]);
      });
    });

    describe('when there is an available todo and a non-available todo', () => {
      it('only returns the available todo', () => {
        const availableTodo = { id: 1 };
        const nonAvailableTodo = { id: 2, completedAt: past };
        const unsavedTodo = { id: null };
        const records = [availableTodo, nonAvailableTodo, unsavedTodo];

        const groups = availableTodoGroups(records);

        expect(groups[0].todos).toEqual([availableTodo]);
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

        const groups = availableTodoGroups(records);

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

    describe('when the categories are sorted out of order', () => {
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

        const groups = availableTodoGroups(records);

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
