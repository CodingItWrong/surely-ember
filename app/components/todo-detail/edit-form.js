import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

const FORMAT_STRING = 'yyyy-MM-dd';
const ENTER_KEY_CODE = 13;

export default class TodoDetailEditFormComponent extends Component {
  @tracked isEditing = false;
  @tracked editedName = null;
  @tracked editedNotes = null;
  @tracked editedDeferredUntil = null;

  @tracked error = null;

  constructor(owner, args) {
    super(owner, args);
    this.initializeFormData();
  }

  initializeFormData() {
    const { todo } = this.args;
    this.editedName = todo.name;
    this.editedNotes = todo.notes;
    this.deferredUntil = this.formatDate(todo.deferredUntil);
  }

  @action
  handleTitleKeyDown(e) {
    if (e.keyCode === ENTER_KEY_CODE) {
      this.handleSave();
      return false;
    }
    return true;
  }

  @action
  async handleSave() {
    const { todo, onSave } = this.args;

    this.error = null;

    const deferredUntilDate = this.parseDate(this.deferredUntil);
    todo.name = this.editedName;
    todo.notes = this.editedNotes;
    todo.deferUntilDate(deferredUntilDate);

    try {
      await todo.save();
      onSave();
    } catch (e) {
      this.error = 'An error occurred saving the todo.';
      // eslint-disable-next-line no-console
      console.error(e);
    }
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
