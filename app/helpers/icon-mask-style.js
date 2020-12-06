import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function iconMaskStyle([icon]) {
  const url = `url(/icons/${icon}.svg)`;
  return htmlSafe(`mask-image: ${url}; -webkit-mask-image: ${url}`);
});
