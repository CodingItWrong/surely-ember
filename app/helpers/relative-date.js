import { helper } from '@ember/component/helper';
import formatRelative from 'date-fns/formatRelative';

export default helper(function relativeDate([date]) {
  if (!date) {
    return date;
  }

  const now = new Date();
  return formatRelative(date, now);
});
