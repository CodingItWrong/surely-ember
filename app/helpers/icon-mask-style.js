import { helper } from '@ember/component/helper';

export default helper(function iconMaskStyle([icon]) {
  return `mask-image: url(/icons/${icon}.svg)`;
});
