import { helper } from '@ember/component/helper';
import addDays from 'date-fns/addDays';

export function deferDateFn({ start, days }) {
  const startToUse = start ?? new Date();
  return addDays(startToUse, days);
}

export default helper(function deferDate(_, { start, days }) {
  return deferDateFn({ start, days });
});
