import { helper } from '@ember/component/helper';
import formatRelative from 'date-fns/formatRelative';
import enUS from 'date-fns/locale/en-US';

// @see https://github.com/date-fns/date-fns/issues/1218
const formatRelativeLocale = {
  lastWeek: "'last' eeee",
  yesterday: "'yesterday'",
  today: "'today'",
  tomorrow: "'tomorrow'",
  nextWeek: 'eeee',
  other: 'MM/dd/yyyy',
};

const locale = {
  ...enUS,
  formatRelative: token => formatRelativeLocale[token],
};

export default helper(function relativeDate([date]) {
  if (!date) {
    return date;
  }

  const now = new Date();
  return formatRelative(date, now, { locale });
});
