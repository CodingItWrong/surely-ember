import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('todos', function () {
    this.route('available');
    this.route('future');
    this.route('completed');
    this.route('deleted');
  });
});
