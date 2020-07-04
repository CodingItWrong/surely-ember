import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

const FORMAT_STRING = 'yyyy-MM-dd';

export default class TodoDetailEditFormComponent extends Component {
  @tracked isEditing = false;
  @tracked editedName = null;
  @tracked editedNotes = null;
  @tracked editedDeferredUntil = null;

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
  async handleSave() {
    const { todo, onSave } = this.args;

    const deferredUntilDate = this.parseDate(this.deferredUntil);
    todo.name = this.editedName;
    todo.notes = this.editedNotes;
    todo.deferUntilDate(deferredUntilDate);
    await todo.save();

    onSave();
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
