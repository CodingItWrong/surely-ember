import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import { action } from '@ember/object';
import { scrollToTop } from 'surely/utils';

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
}
