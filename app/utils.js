import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import groupBy from 'lodash-es/groupBy';
import sortBy from 'lodash-es/sortBy';
import ENV from 'surely/config/environment';

const FORMAT_STRING = 'yyyy-MM-dd';

export const scrollToTop = () => window.scrollTo(0, 0);
export const count = (array, test) => array.filter(test).length;
export const prop = name => object => object[name];
export const tomorrow = () => {
  const now = new Date();
  return startOfDay(addDays(now, 1));
};

export const parseDate = dateString => {
  return parse(dateString, FORMAT_STRING, new Date());
};

export const formatDate = date => {
  if (!date) {
    return date;
  }

  return format(date, FORMAT_STRING);
};

export const logRuntimeError = error => {
  if (ENV.environment !== 'test') {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const groupTodosByCategorySorted = todos => {
  const todosWithCategoryName = todos.map(todo => ({
    todo,
    categoryName: todo.category?.get('name'),
  }));
  const groupsObject = groupBy(todosWithCategoryName, 'categoryName');
  const groups = Object.entries(groupsObject).map(([, todoWrappers]) => {
    return {
      name: todoWrappers[0].categoryName ?? 'No Category',
      todos: todoWrappers.map(wrapper => wrapper.todo),
    };
  });
  const sortedGroups = sortBy(groups, group =>
    group.todos[0].category?.get('sortOrder'),
  );
  return sortedGroups;
};
