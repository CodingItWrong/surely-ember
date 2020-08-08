import Model, { attr, hasMany } from '@ember-data/model';

export default class CategoryModel extends Model {
  @attr name;
  @attr sortOrder;
  @hasMany('todo') todos;
}
