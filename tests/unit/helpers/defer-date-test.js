import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { deferDateFn } from 'surely/helpers/defer-date';

module('Unit | Helper | defer-date', function (hooks) {
  setupTest(hooks);

  const now = new Date();
  const yesterday = startOfDay(addDays(now, -1));
  const tomorrow = startOfDay(addDays(now, 1));
  const twoDaysFromNow = startOfDay(addDays(now, 2));
  const threeDaysFromNow = startOfDay(addDays(now, 3));

  test('it can get the next day', function (assert) {
    let result = deferDateFn({
      start: tomorrow,
      days: 1,
    });
    assert.deepEqual(result, twoDaysFromNow);
  });

  test('it can advance multiple days', function (assert) {
    let result = deferDateFn({
      start: tomorrow,
      days: 2,
    });
    assert.deepEqual(result, threeDaysFromNow);
  });

  test('it adjusts for the start date', function (assert) {
    let result = deferDateFn({
      start: twoDaysFromNow,
      days: 1,
    });
    assert.deepEqual(result, threeDaysFromNow);
  });

  test('it defaults to start on the current day', function (assert) {
    let result = deferDateFn({ now, days: 1 });
    assert.deepEqual(result, tomorrow);
  });

  test('it starts from the current date when the passed-in date is in the past', function (assert) {
    let result = deferDateFn({ now, start: yesterday, days: 1 });
    assert.deepEqual(result, tomorrow);
  });
});
