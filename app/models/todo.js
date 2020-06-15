import Model, { attr } from '@ember-data/model';

export default class TodoModel extends Model {
  @attr name;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('date') completedAt;
  @attr('date') deletedAt;
  @attr('date') deferredAt;
  @attr('date') deferredUntil;
}
