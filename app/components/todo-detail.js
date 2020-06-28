import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

const BUTTON_SET = {
  ACTIONS: 'actions',
  DEFER: 'defer',
  DEFER_UNTIL_DATE: 'defer_until_date',
};

const FORMAT_STRING = 'yyyy-MM-dd';

export default class TodoDetailComponent extends Component {
  @tracked buttonSet = BUTTON_SET.ACTIONS;
  @tracked deferredUntil = null;

  @tracked isEditing = false;

  @action
  async complete() {
    const { todo, onHandle } = this.args;
    todo.completedAt = new Date();
    await todo.save();
    onHandle();
  }

  @action
  uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;
    todo.save();
  }

  @action
  async delete() {
    const { todo, onHandle } = this.args;
    todo.deletedAt = new Date();
    await todo.save();
    onHandle();
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
  async deferOneDay() {
    const { todo, onHandle } = this.args;
    todo.deferOneDay();
    await todo.save();
    this.buttonSet = BUTTON_SET.ACTIONS;
    onHandle();
  }

  @action
  deferUntilDate() {
    const { todo } = this.args;
    this.deferredUntil = this.formatDate(todo.deferredUntil);
    this.buttonSet = BUTTON_SET.DEFER_UNTIL_DATE;
  }

  @action
  async saveEnteredDeferredDate() {
    if (!this.deferredUntil) {
      return;
    }

    const deferredUntilDate = this.parseDate(this.deferredUntil);

    const { todo, onHandle } = this.args;
    todo.deferUntilDate(deferredUntilDate);
    await todo.save();
    this.buttonSet = BUTTON_SET.ACTIONS;

    this.deferredUntil = null;
    onHandle();
  }

  @action
  edit() {
    this.isEditing = true;
  }

  @action
  stopEditing() {
    this.isEditing = false;
  }

  parseDate(dateString) {
    return parse(dateString, FORMAT_STRING, new Date());
  }

  formatDate(date) {
    if (!date) {
      return date;
    }

    return format(date, FORMAT_STRING);
  }
}
