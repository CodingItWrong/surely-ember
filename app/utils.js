import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

export const scrollToTop = () => window.scrollTo(0, 0);
export const count = (array, test) => array.filter(test).length;
export const prop = name => object => object[name];
export const tomorrow = () => {
  const now = new Date();
  return startOfDay(addDays(now, 1));
};
