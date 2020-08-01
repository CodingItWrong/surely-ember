import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { count, prop } from 'surely/utils';

const unauthenticatedRoutes = ['user.new'];

export default class ApplicationController extends Controller {
  @service router;
  @service session;
  @service sidebarCounts;

  get availableTodoCount() {
    if (this.sidebarCounts.availableCount !== null) {
      return this.sidebarCounts.availableCount;
    } else {
      return count(this.model, prop('isAvailable'));
    }
  }

  get tomorrowTodoCount() {
    if (this.sidebarCounts.tomorrowCount !== null) {
      return this.sidebarCounts.tomorrowCount;
    } else {
      return count(this.model, prop('isTomorrow'));
    }
  }

  get currentRouteIsUnauthenticated() {
    return unauthenticatedRoutes.includes(this.router.currentRouteName);
  }

  get routeRequiresAuthentication() {
    return !this.currentRouteIsUnauthenticated && !this.session.isAuthenticated;
  }

  @action
  handleSignIn() {
    this.send('refreshApplicationModel');
    this.router.transitionTo('todos.available');
  }
}
