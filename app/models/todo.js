import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default class TodoModel extends Model {
  @attr name;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('date') completedAt;
  @attr('date') deletedAt;
  @attr('date') deferredAt;
  @attr('date') deferredUntil;

  static STATUS = {
    AVAILABLE: 'AVAILABLE',
    COMPLETED: 'COMPLETED',
    DELETED: 'DELETED',
    FUTURE: 'FUTURE',
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
}
