import { module, test } from 'qunit';
import { groupTodosByCategorySorted } from 'surely/utils';

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
          name: category1.name,
          todos: [todoCategory1],
        },
        {
          name: category2.name,
          todos: [todoCategory2],
        },
        {
          name: 'No Category',
          todos: [todoNoCategory],
        },
      ]);
    });
  });
});
