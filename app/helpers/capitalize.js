import { helper } from '@ember/component/helper';

export const capitalizeFn = string => {
  if (typeof string !== 'string') {
    return string;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default helper(function capitalize([string]) {
  return capitalizeFn(string);
});
