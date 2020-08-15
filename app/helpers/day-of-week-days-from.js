import { helper } from '@ember/component/helper';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

const dayOfWeekFormat = 'EEEE';

export function dayOfWeekDaysFromFn({ start, days }) {
  const startToUse = start ?? new Date();
  const date = addDays(startToUse, days);
  return format(date, dayOfWeekFormat);
}

export default helper(function dayOfWeekDaysFrom(_, { start, days }) {
  return dayOfWeekDaysFromFn({ start, days });
});
