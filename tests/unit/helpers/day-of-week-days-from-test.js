import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { dayOfWeekDaysFromFn } from 'surely/helpers/day-of-week-days-from';

module('Unit | Helper | day-of-week-days-from', function (hooks) {
  setupTest(hooks);

  const mondayNineAM = new Date(2020, 0, 6, 9, 0, 0);
  const mondayMidnight = new Date(2020, 0, 6, 0, 0, 0);
  const mondayJustBeforeMidnight = new Date(2020, 0, 6, 11, 59, 59);
  const thursdayNineAM = new Date(2020, 0, 9, 9, 0, 0);

  test('it can report the next day', function (assert) {
    let result = dayOfWeekDaysFromFn({
      start: mondayNineAM,
      days: 1,
    });
    assert.equal(result, 'Tuesday');
  });

  test('it can report two days from now', function (assert) {
    let result = dayOfWeekDaysFromFn({
      start: mondayNineAM,
      days: 2,
    });
    assert.equal(result, 'Wednesday');
  });

  test('it adjusts for the start date', function (assert) {
    let result = dayOfWeekDaysFromFn({
      start: thursdayNineAM,
      days: 1,
    });
    assert.equal(result, 'Friday');
  });

  test('it chooses the correct date at midnight', function (assert) {
    let result = dayOfWeekDaysFromFn({
      start: mondayMidnight,
      days: 1,
    });
    assert.equal(result, 'Tuesday');
  });

  test('it chooses the correct date just before midnight', function (assert) {
    let result = dayOfWeekDaysFromFn({
      start: mondayJustBeforeMidnight,
      days: 1,
    });
    assert.equal(result, 'Tuesday');
  });
});
