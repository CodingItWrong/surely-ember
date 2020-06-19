import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

const BUTTON_SET = {
  ACTIONS: 'actions',
  DEFER: 'defer',
};

export default class TodoDetailComponent extends Component {
  @tracked buttonSet = BUTTON_SET.ACTIONS;

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
  }

  @action
  async deferOneDay() {
    const { todo } = this.args;

    const now = new Date();
    const currentDate = todo.deferredUntil || now;
    const tomorrow = startOfDay(addDays(currentDate, 1));

    todo.deferredUntil = tomorrow;
    todo.deferredAt = now;

    await todo.save();

    this.buttonSet = BUTTON_SET.ACTIONS;
  }
}
