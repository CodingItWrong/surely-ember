import { helper } from '@ember/component/helper';
import addDays from 'date-fns/addDays';

export function deferDateFn({ start, days }) {
  const now = new Date();
  let startToUse;
  if (!start || start < now) {
    // no future defer date: defer 1 day from now
    startToUse = now;
  } else {
    // already future: defer one additional day
    startToUse = start;
  }

  return addDays(startToUse, days);
}

export default helper(function deferDate(_, { start, days }) {
  return deferDateFn({ start, days });
});
