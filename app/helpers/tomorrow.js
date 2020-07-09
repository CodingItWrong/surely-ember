import { helper } from '@ember/component/helper';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

export default helper(function tomorrow() {
  const now = new Date();
  return startOfDay(addDays(now, 1));
});
