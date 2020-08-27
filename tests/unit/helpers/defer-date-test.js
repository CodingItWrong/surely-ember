import addDays from 'date-fns/addDays';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { deferDateFn } from 'surely/helpers/defer-date';

module('Unit | Helper | defer-date', function (hooks) {
  setupTest(hooks);

  // TODO: make these work indefinitely in the future, maybe just pick Jan of next year and ignore days of week
  const mondayNineAM = new Date(2021, 0, 6, 9, 0, 0);
  const tuesdayNineAM = new Date(2021, 0, 7, 9, 0, 0);
  const wednesdayNineAM = new Date(2021, 0, 8, 9, 0, 0);

  test('it can get the next day', function (assert) {
    let result = deferDateFn({
      start: mondayNineAM,
      days: 1,
    });
    assert.deepEqual(result, tuesdayNineAM);
  });

  test('it can get two days from now', function (assert) {
    let result = deferDateFn({
      start: mondayNineAM,
      days: 2,
    });
    assert.deepEqual(result, wednesdayNineAM);
  });

  test('it adjusts for the start date', function (assert) {
    let result = deferDateFn({
      start: tuesdayNineAM,
      days: 1,
    });
    assert.deepEqual(result, wednesdayNineAM);
  });

  test('it defaults to start on the current day', function (assert) {
    const now = new Date();
    const tomorrow = addDays(now, 1);

    let result = deferDateFn({ now, days: 1 });
    assert.deepEqual(result, tomorrow);
  });

  test('it starts from the current date when the passed-in date is in the past', function (assert) {
    const now = new Date();
    const yesterday = addDays(now, -1);
    const tomorrow = addDays(now, 1);

    let result = deferDateFn({ now, start: yesterday, days: 1 });
    assert.deepEqual(result, tomorrow);
  });
});
