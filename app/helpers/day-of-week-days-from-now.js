import { helper } from '@ember/component/helper';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

const dayOfWeekFormat = 'EEEE';

export default helper(function dayOfWeekDaysFromNow([numDays]) {
  const now = new Date();
  const date = addDays(now, numDays);
  return format(date, dayOfWeekFormat);
});
