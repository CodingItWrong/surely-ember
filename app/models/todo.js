import Model, { attr } from '@ember-data/model';

export default class TodoModel extends Model {
  @attr name;
  @attr createdAt;
  @attr updatedAt;
  @attr completedAt;
  @attr deletedAt;
  @attr deferredAt;
  @attr deferredUntil;
}
