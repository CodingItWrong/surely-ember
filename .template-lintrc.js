'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-action': false, // ember-paper requires it
    'no-curly-component-invocation': {
      allow: ['day-of-week-days-from'], // helper
    },
    'no-implicit-this': {
      allow: ['tomorrow'], // helper
    },
  },
};
