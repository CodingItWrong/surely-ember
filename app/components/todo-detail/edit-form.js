import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { parseDate, formatDate } from 'surely/utils';

const ENTER_KEY_CODE = 13;

export default class TodoDetailEditFormComponent extends Component {
  @tracked isEditing = false;
  @tracked editedName = null;
  @tracked editedNotes = null;
  @tracked editedDeferredUntil = null;

  @tracked saving = false;
  @tracked error = null;

  constructor(owner, args) {
    super(owner, args);
    this.initializeFormData();
  }

  initializeFormData() {
    const { todo } = this.args;
    this.editedName = todo.name;
    this.editedNotes = todo.notes;
    this.deferredUntil = formatDate(todo.deferredUntil);
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

    const deferredUntilDate = parseDate(this.deferredUntil);
    todo.name = this.editedName;
    todo.notes = this.editedNotes;
    todo.deferUntilDate(deferredUntilDate);

    try {
      this.saving = true;
      await todo.save();
      onSave();
    } catch (e) {
      this.saving = false;
      this.error = 'An error occurred saving the todo.';
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
