import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { formatDate, logRuntimeError, parseDate } from 'surely/utils';

const ENTER_KEY_CODE = 13;

export default class TodoDetailEditFormComponent extends Component {
  @tracked isEditing = false;
  @tracked editedName = null;
  @tracked editedCategory = null;
  @tracked editedNotes = null;
  @tracked editedDeferredUntil = null;

  @tracked saving = false;
  @tracked errorMessage = null;

  constructor(owner, args) {
    super(owner, args);
    this.initializeFormData();
  }

  initializeFormData() {
    const { todo } = this.args;
    this.editedName = todo.name;
    this.editedCategory = todo.category;
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
  async handleSave(e) {
    e?.preventDefault();
    const { todo, onSave } = this.args;

    this.errorMessage = null;

    const deferredUntilDate = parseDate(this.deferredUntil);
    todo.name = this.editedName;
    todo.category = this.editedCategory;
    todo.notes = this.editedNotes;
    todo.deferUntilDate(deferredUntilDate);

    try {
      this.saving = true;
      await todo.save();
      onSave();
    } catch (e) {
      this.saving = false;
      this.errorMessage = 'An error occurred saving the todo.';
      logRuntimeError(e);
    }
  }
}
