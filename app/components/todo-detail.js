import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import pick from 'lodash-es/pick';

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
  @tracked error = null;

  @tracked displayModel;

  constructor(owner, args) {
    super(owner, args);
    this.updateDisplayModel();
  }

  updateDisplayModel() {
    const { todo } = this.args;

    this.displayModel = pick(todo, [
      'id',
      'name',
      'notes',
      'isDeleted',
      'deletedAt',
      'isCompleted',
      'completedAt',
      'deferredUntil',
      'createdAt',
    ]);
  }

  @action
  resetStateIfModelChanged() {
    const { todo } = this.args;

    if (this.displayModel?.todo?.id !== todo.id) {
      this.updateDisplayModel();
      this.buttonSet = BUTTON_SET.ACTIONS;
      this.isEditing = false;
    }
  }

  @action
  async complete() {
    const { todo, onHandle } = this.args;
    todo.completedAt = new Date();

    this.error = null;
    try {
      await todo.save();
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while completing the todo.';
      console.error(e);
    }
  }

  @action
  async uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;

    this.error = null;
    try {
      await todo.save();
      this.updateDisplayModel();
    } catch (e) {
      this.error = 'An error occurred while uncompleting the todo.';
      console.error(e);
    }
  }

  @action
  async delete() {
    const { todo, onHandle } = this.args;
    todo.deletedAt = new Date();

    this.error = null;
    try {
      await todo.save();
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deleting the todo.';
      console.error(e);
    }
  }

  @action
  async undelete() {
    const { todo } = this.args;
    todo.deletedAt = null;
    todo.completedAt = null;

    this.error = null;
    try {
      await todo.save();
      this.updateDisplayModel();
    } catch (e) {
      this.error = 'An error occurred while undeleting the todo.';
      console.error(e);
    }
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

    this.error = null;
    try {
      await todo.save();
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deferring the todo.';
      console.error(e);
    }
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

    this.error = null;
    try {
      await todo.save();
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deferring the todo.';
      console.error(e);
    }
  }

  @action
  edit() {
    this.isEditing = true;
  }

  @action
  handleSave() {
    this.updateDisplayModel();
    this.isEditing = false;
  }

  @action
  handleCancel() {
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
