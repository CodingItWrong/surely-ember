import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import { action } from '@ember/object';
import {
  scrollToTop,
  arrayWithItemMovedDownward,
  arrayWithItemMovedUpward,
  elementsWithIndex,
} from 'surely/utils';

export default class CategoriesDataController extends Controller {
  @service router;

  sortPropertiesSortOrderField = Object.freeze(['sortOrder:asc,name:asc']);

  @sort('model', 'sortPropertiesSortOrderField')
  sortedCategories;

  @action
  goToList() {
    this.router.transitionTo('categories.data');
  }

  @action
  handleChooseCategory(category) {
    this.router.transitionTo('categories.data.detail', category.id);
    scrollToTop();
  }

  @action
  handleRefresh() {
    this.goToList();
    this.send('refresh');
  }

  @action
  goToNew() {
    this.router.transitionTo('categories.data.new');
  }

  @action
  async moveUpward(categoryToMove) {
    const categoriesAfterMove = arrayWithItemMovedUpward(
      this.sortedCategories,
      categoryToMove,
    );
    this.updateCategorySortOrder(categoriesAfterMove);
  }

  @action
  async moveDownward(categoryToMove) {
    const categoriesAfterMove = arrayWithItemMovedDownward(
      this.sortedCategories,
      categoryToMove,
    );
    this.updateCategorySortOrder(categoriesAfterMove);
  }

  async updateCategorySortOrder(sortedCategories) {
    const categoriesWithIndex = elementsWithIndex(sortedCategories);
    for (const [category, sortOrder] of categoriesWithIndex) {
      category.sortOrder = sortOrder;
      await category.save();
    }
  }
}
