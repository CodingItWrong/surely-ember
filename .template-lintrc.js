'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-action': false, // ember-paper requires it
    'no-implicit-this': {
      allow: ['tomorrow'],
    },
  },
};
