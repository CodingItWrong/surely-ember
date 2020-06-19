import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import parse from 'date-fns/parse';

const BUTTON_SET = {
  ACTIONS: 'actions',
  DEFER: 'defer',
  DEFER_UNTIL_DATE: 'defer_until_date',
};

export default class TodoDetailComponent extends Component {
  @tracked buttonSet = BUTTON_SET.ACTIONS;
  @tracked deferredUntil = null;

  @action
  complete() {
    const { todo } = this.args;
    todo.completedAt = new Date();
    todo.save();
  }

  @action
  uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;
    todo.save();
  }

  @action
  delete() {
    const { todo } = this.args;
    todo.deletedAt = new Date();
    todo.save();
  }

  @action
  undelete() {
    const { todo } = this.args;
    todo.deletedAt = null;
    todo.completedAt = null;
    todo.save();
  }

  @action
  defer() {
    this.buttonSet = BUTTON_SET.DEFER;
  }

  @action
  cancelDefer() {
    this.buttonSet = BUTTON_SET.ACTIONS;
    this.deferredUntil = null;
  }

  @action
  deferOneDay() {
    const { todo } = this.args;

    const now = new Date();
    const currentDate = todo.deferredUntil || now;
    const tomorrow = startOfDay(addDays(currentDate, 1));

    this.saveDeferUntilDate(tomorrow);
  }

  @action
  deferUntilDate() {
    this.deferredUntil = null;
    this.buttonSet = BUTTON_SET.DEFER_UNTIL_DATE;
  }

  @action
  async saveEnteredDeferredDate() {
    const deferredUntilDate = parse(
      this.deferredUntil,
      'yyyy-MM-dd',
      new Date(),
    );
    await this.saveDeferUntilDate(deferredUntilDate);
    this.deferredUntil = null;
  }

  async saveDeferUntilDate(deferredUntil) {
    const { todo } = this.args;

    todo.deferredUntil = deferredUntil;
    todo.deferredAt = new Date();

    await todo.save();

    this.buttonSet = BUTTON_SET.ACTIONS;
  }
}
