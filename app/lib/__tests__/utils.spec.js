import { groupTodosByCategorySorted } from '../utils';

describe('utils', () => {
  describe('groupTodosByCategorySorted', () => {
    describe('when there are no available todos', () => {
      it('returns an empty array', () => {
        const records = [];

        const groups = groupTodosByCategorySorted(records);

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

        const groups = groupTodosByCategorySorted(records);

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

        const groups = groupTodosByCategorySorted(records);

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

        const groups = groupTodosByCategorySorted(records);

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

        const groups = groupTodosByCategorySorted(records);

        expect(groups[0].todos).toEqual([record2, record1]);
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

        const groups = groupTodosByCategorySorted(records);

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

        const groups = groupTodosByCategorySorted(records);

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
