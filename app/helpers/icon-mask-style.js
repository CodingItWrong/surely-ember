import { helper } from '@ember/component/helper';

export default helper(function iconMaskStyle([icon]) {
  const url = `url(/icons/${icon}.svg)`;
  return `mask-image: ${url}; -webkit-mask-image: ${url}`;
});
