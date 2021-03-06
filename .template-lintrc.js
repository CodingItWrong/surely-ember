'use strict';

module.exports = {
  extends: ['octane', 'stylistic'],
  rules: {
    'eol-last': 'always',
    'no-action': false, // ember-paper requires it
    'no-curly-component-invocation': {
      allow: ['day-of-week-days-from'], // helper
    },
    'no-down-event-binding': false,
    'no-implicit-this': {
      allow: ['tomorrow'], // helper
    },
    'require-input-label': false,
  },
};
