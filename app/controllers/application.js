import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

const unauthenticatedRoutes = ['user.new'];

export default class ApplicationController extends Controller {
  @service router;
  @service session;

  get currentRouteIsUnauthenticated() {
    return unauthenticatedRoutes.includes(this.router.currentRouteName);
  }

  get routeRequiresAuthentication() {
    return !this.currentRouteIsUnauthenticated && !this.session.isAuthenticated;
  }
}
