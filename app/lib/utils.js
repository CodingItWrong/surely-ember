import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

export function groupTodosByCategorySorted(todos) {
  const groupsObject = groupBy(todos, todo => todo.category?.name);
  const groups = Object.entries(groupsObject).map(([, todos]) => ({
    name: todos[0].category?.name ?? 'No Category',
    todos: sortBy(todos, 'name'),
  }));
  const sortedGroups = sortBy(
    groups,
    group => group.todos[0].category?.sortOrder ?? -9999,
  );
  return sortedGroups;
}
