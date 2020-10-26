import { helper } from '@ember/component/helper';
import { tomorrow as tomorrowFn } from 'surely/utils';

export default helper(function tomorrow() {
  return tomorrowFn();
});
