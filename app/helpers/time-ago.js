import { helper } from '@ember/component/helper';
import formatDistance from 'date-fns/formatDistance';

export default helper(function timeAgo([date]) {
  if (!date) {
    return date;
  }

  const now = new Date();
  return `${formatDistance(date, now)} ago`;
});
