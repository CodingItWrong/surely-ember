import { module, test } from 'qunit';
import {
  arrayWithItemMovedDownward,
  arrayWithItemMovedUpward,
  groupTodosByCategorySorted,
} from 'surely/utils';

module('Unit | utils', function () {
  module('groupTodosByCategorySorted', function () {
    test('it returns an empty array for an empty array', function (assert) {
      const todos = [];
      const result = groupTodosByCategorySorted(todos);
      assert.deepEqual(result, [], 'result should be empty');
    });

    test('it groups todos by category sorted by sort order', async function (assert) {
      const category1 = { name: 'Z Category 1', sortOrder: 1 };
      const category2 = { name: 'A Category 2', sortOrder: 2 };

      const todoNoCategory = { name: 'Todo No Category' };
      const todoCategory1 = { name: 'Todo Category 1', category: category1 };
      const todoCategory2 = { name: 'Todo Category 2', category: category2 };

      const todos = [todoCategory2, todoNoCategory, todoCategory1];
      const result = groupTodosByCategorySorted(todos);
      assert.deepEqual(result, [
        {
          name: 'No Category',
          todos: [todoNoCategory],
        },
        {
          name: category1.name,
          todos: [todoCategory1],
        },
        {
          name: category2.name,
          todos: [todoCategory2],
        },
      ]);
    });
  });

  module('arrayWithItemMovedDownward', function () {
    const item1 = { name: 'Item 1' };
    const item2 = { name: 'Item 2' };
    const item3 = { name: 'Item 3' };
    const item4 = { name: 'Item 4' };

    test('it moves an item at the start downward', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedDownward(array, item1);
      assert.deepEqual(result, [item2, item1, item3, item4]);
    });

    test('it moves an item in the middle downward', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedDownward(array, item2);
      assert.deepEqual(result, [item1, item3, item2, item4]);
    });

    test('it does not move an item at the end', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedDownward(array, item4);
      assert.deepEqual(result, array);
    });
  });

  module('arrayWithItemMovedUpward', function () {
    const item1 = { name: 'Item 1' };
    const item2 = { name: 'Item 2' };
    const item3 = { name: 'Item 3' };
    const item4 = { name: 'Item 4' };

    test('it moves an item at the end upward', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedUpward(array, item4);
      assert.deepEqual(result, [item1, item2, item4, item3]);
    });

    test('it moves an item in the middle upward', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedUpward(array, item3);
      assert.deepEqual(result, [item1, item3, item2, item4]);
    });

    test('it does not move an item at the start', async function (assert) {
      const array = [item1, item2, item3, item4];
      const result = arrayWithItemMovedUpward(array, item1);
      assert.deepEqual(result, array);
    });
  });
});
