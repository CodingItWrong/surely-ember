import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { logRuntimeError } from 'surely/utils';
import { inject as service } from '@ember/service';

const ENTER_KEY_CODE = 13;

export default class CategoryDetailComponent extends Component {
  @service store;

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
    this.editingId = category?.id;
    this.editedName = category?.name;
    this.editedSortOrder = category?.sortOrder;
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
    if (!this.validate()) {
      return;
    }

    let { category, onCreate } = this.args;

    this.error = null;

    const isNew = !category;
    if (isNew) {
      // TODO: testing store could be hard
      category = this.store.createRecord('category', {
        name: this.editedName,
        sortOrder: this.editedSortOrder,
      });
    } else {
      category.name = this.editedName;
      category.sortOrder = this.editedSortOrder;
    }

    try {
      this.saving = true;
      await category.save();

      if (isNew) {
        onCreate(category);
      }
    } catch (e) {
      this.error = 'An error occurred saving the category.';
      logRuntimeError(e);
    }

    this.saving = false;
  }

  validate() {
    if (!this.editedName) {
      return false;
    }

    return true;
  }

  @action
  async handleDelete() {
    const { category, onDelete } = this.args;

    try {
      await category.destroyRecord();
      onDelete();
    } catch (e) {
      this.error = 'An error occurred deleting the category.';
      logRuntimeError(e);
    }
  }
}