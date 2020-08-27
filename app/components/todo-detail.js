import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import pick from 'lodash-es/pick';
import { formatDate, logRuntimeError, parseDate } from 'surely/utils';

const BUTTON_SET = {
  ACTIONS: 'actions',
  DEFER: 'defer',
  DEFER_UNTIL_DATE: 'defer_until_date',
};

const delay = (promise, milliseconds = 0) => {
  if (milliseconds === 0) {
    return promise;
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        promise.then(resolve);
      }, milliseconds);
    });
  }
};

export default class TodoDetailComponent extends Component {
  @tracked buttonSet = BUTTON_SET.ACTIONS;
  @tracked deferredUntil = null;

  @tracked isEditing = false;
  @tracked error = null;

  @tracked isCompleting = false;
  @tracked isUncompleting = false;
  @tracked isDeleting = false;
  @tracked isUndeleting = false;
  @tracked isDeferring = false;

  @tracked displayModel;

  get isProcessing() {
    return [
      this.isCompleting,
      this.isUncompleting,
      this.isDeleting,
      this.isUndeleting,
      this.isDeferring,
    ].find(flag => flag);
  }

  constructor(owner, args) {
    super(owner, args);
    this.updateDisplayModel();
  }

  updateDisplayModel() {
    const { todo } = this.args;

    this.displayModel = pick(todo, [
      'id',
      'name',
      'category',
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
    this.isCompleting = true;
    try {
      await delay(todo.save());
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while completing the todo.';
      logRuntimeError(e);
      this.isCompleting = false;
    }
  }

  @action
  async uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;

    this.error = null;
    this.isUncompleting = true;
    try {
      await delay(todo.save());
      this.updateDisplayModel();
    } catch (e) {
      this.error = 'An error occurred while uncompleting the todo.';
      logRuntimeError(e);
    } finally {
      this.isUncompleting = false;
    }
  }

  @action
  async delete() {
    const { todo, onHandle } = this.args;
    todo.deletedAt = new Date();

    this.error = null;
    this.isDeleting = true;
    try {
      await delay(todo.save());
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deleting the todo.';
      logRuntimeError(e);
      this.isDeleting = false;
    }
  }

  @action
  async undelete() {
    const { todo } = this.args;
    todo.deletedAt = null;
    todo.completedAt = null;

    this.error = null;
    this.isUndeleting = true;
    try {
      await delay(todo.save());
      this.updateDisplayModel();
    } catch (e) {
      this.error = 'An error occurred while undeleting the todo.';
      logRuntimeError(e);
    } finally {
      this.isUndeleting = false;
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
  async saveDeferUntilDate(date) {
    const { todo, onHandle } = this.args;
    todo.deferUntilDate(date);

    this.error = null;
    this.isDeferring = true;
    try {
      await delay(todo.save());
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deferring the todo.';
      logRuntimeError(e);
      this.isDeferring = false;
    }
  }

  @action
  deferUntilDate() {
    const { todo } = this.args;
    this.deferredUntil = formatDate(todo.deferredUntil);
    this.buttonSet = BUTTON_SET.DEFER_UNTIL_DATE;
  }

  @action
  async saveEnteredDeferredDate() {
    if (!this.deferredUntil) {
      return;
    }

    const deferredUntilDate = parseDate(this.deferredUntil);

    const { todo, onHandle } = this.args;
    todo.deferUntilDate(deferredUntilDate);

    this.error = null;
    this.isDeferring = true;
    try {
      await delay(todo.save());
      onHandle();
    } catch (e) {
      this.error = 'An error occurred while deferring the todo.';
      logRuntimeError(e);
      this.isDeferring = false;
    }
  }

  @action
  edit() {
    this.isEditing = true;
  }

  @action
  handleSave() {
    const { onHandle } = this.args;
    onHandle();
  }

  @action
  handleCancel() {
    this.isEditing = false;
  }
}
