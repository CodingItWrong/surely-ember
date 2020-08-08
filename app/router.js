import EmberRouter from '@ember/routing/router';
import config from 'surely/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('todos', function () {
    this.route('available', function () {
      this.route('data', { path: '/' }, function () {
        this.route('detail', { path: '/:todo_id' });
      });
    });
    this.route('tomorrow', function () {
      this.route('data', { path: '/' }, function () {
        this.route('detail', { path: '/:todo_id' });
      });
    });
    this.route('future', function () {
      this.route('data', { path: '/' }, function () {
        this.route('detail', { path: '/:todo_id' });
      });
    });
    this.route('completed', function () {
      this.route('data', { path: '/' }, function () {
        this.route('detail', { path: '/:todo_id' });
      });
    });
    this.route('deleted', function () {
      this.route('data', { path: '/' }, function () {
        this.route('detail', { path: '/:todo_id' });
      });
    });
  });

  this.route('user', function () {
    this.route('new');
  });
  this.route('categories', function () {
    this.route('data', { path: '/' }, function () {
      this.route('detail', { path: '/:category_id' });
    });
  });
});
