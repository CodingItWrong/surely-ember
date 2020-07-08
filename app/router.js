import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('todos', function () {
    this.route('available', function () {
      this.route('detail', { path: '/:todo_id' });
    });
    this.route('tomorrow', function () {
      this.route('detail', { path: '/:todo_id' });
    });
    this.route('future', function () {
      this.route('detail', { path: '/:todo_id' });
    });
    this.route('completed', function () {
      this.route('detail', { path: '/:todo_id' });
    });
    this.route('deleted', function () {
      this.route('detail', { path: '/:todo_id' });
    });
  });
});
