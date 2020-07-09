import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

export default class TodoModel extends Model {
  @attr name;
  @attr notes;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('date') completedAt;
  @attr('date') deletedAt;
  @attr('date') deferredAt;
  @attr('date') deferredUntil;

  static STATUS = {
    AVAILABLE: 'available',
    COMPLETED: 'completed',
    DELETED: 'deleted',
    FUTURE: 'future',
  };

  @computed('deletedAt', 'completedAt', 'deferredUntil')
  get status() {
    if (this.deletedAt) {
      return TodoModel.STATUS.DELETED;
    } else if (this.completedAt) {
      return TodoModel.STATUS.COMPLETED;
    } else if (this.deferredUntil > new Date()) {
      return TodoModel.STATUS.FUTURE;
    } else {
      return TodoModel.STATUS.AVAILABLE;
    }
  }

  @computed('status')
  get isAvailable() {
    return this.status === TodoModel.STATUS.AVAILABLE;
  }

  @computed('status')
  get isCompleted() {
    return this.status === TodoModel.STATUS.COMPLETED;
  }

  @computed('status')
  get isDeleted() {
    return this.status === TodoModel.STATUS.DELETED;
  }

  @computed('status')
  get isFuture() {
    return this.status === TodoModel.STATUS.FUTURE;
  }

  @computed('isFuture', 'deferredUntil')
  get isTomorrow() {
    if (!this.isFuture) {
      return false;
    }

    const now = new Date();
    const twoDaysFromNow = startOfDay(addDays(now, 2));
    return this.deferredUntil < twoDaysFromNow;
  }

  deferOneDay() {
    const now = new Date();
    let startDate;
    if (!this.deferredUntil || this.deferredUntil < now) {
      // no future defer date: defer 1 day from now
      startDate = now;
    } else {
      // already future: defer one additional day
      startDate = this.deferredUntil;
    }
    this.deferUntilDate(startOfDay(addDays(startDate, 1)));
  }

  deferUntilDate(deferredUntil) {
    this.deferredUntil = deferredUntil;
    this.deferredAt = new Date();
  }
}
