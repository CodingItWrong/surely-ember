import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { logRuntimeError } from 'surely/utils';

const ENTER_KEY_CODE = 13;

export default class CategoryDetailComponent extends Component {
  @tracked editingId = null;
  @tracked editedName = null;
  @tracked editedSortOrder = null;

  @tracked saving = false;
  @tracked error = null;

  constructor(owner, args) {
    super(owner, args);
    this.initializeFormData();
  }

  initializeFormData() {
    const { category } = this.args;
    this.editingId = category.id;
    this.editedName = category.name;
    this.editedSortOrder = category.sortOrder;
  }

  @action
  resetStateIfModelChanged() {
    const { category } = this.args;

    if (this.editingId !== category.id) {
      this.initializeFormData();
    }
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
    const { category } = this.args;

    this.error = null;

    category.name = this.editedName;
    category.sortOrder = this.editedSortOrder;

    try {
      this.saving = true;
      await category.save();
    } catch (e) {
      this.error = 'An error occurred saving the category.';
      logRuntimeError(e);
    }

    this.saving = false;
  }
}
