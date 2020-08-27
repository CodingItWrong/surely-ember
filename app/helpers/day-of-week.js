import { helper } from '@ember/component/helper';
import format from 'date-fns/format';

const dayOfWeekFormat = 'EEEE';

export function dayOfWeekFn(date) {
  return format(date, dayOfWeekFormat);
}

export default helper(function dayOfWeek([date]) {
  return dayOfWeekFn(date);
});
