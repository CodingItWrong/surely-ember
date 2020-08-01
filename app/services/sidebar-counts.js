import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { count, prop } from 'surely/utils';

export default class SidebarCountsService extends Service {
  @tracked availableCount = null;
  @tracked tomorrowCount = null;

  async freezeDuring(oldTodos, asyncCallback) {
    this.availableCount = count(oldTodos, prop('isAvailable'));
    this.tomorrowCount = count(oldTodos, prop('isTomorrow'));

    const todos = await asyncCallback();

    this.availableCount = null;
    this.tomorrowCount = null;

    return todos;
  }
}
