import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { action } from '@ember/object';

const unauthenticatedRoutes = ['user.new'];

const count = (array, test) => array.filter(test).length;
const prop = name => object => object[name];

export default class ApplicationController extends Controller {
  @service router;
  @service session;

  @computed('model.@each.isAvailable')
  get availableTodoCount() {
    return count(this.model, prop('isAvailable'));
  }

  @computed('model.@each.isTomorrow')
  get tomorrowTodoCount() {
    return count(this.model, prop('isTomorrow'));
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
