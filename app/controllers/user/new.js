import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UserNewController extends Controller {
  @service session;
  @service router;

  @action goToSignIn() {
    this.router.transitionTo('index');
  }

  @action
  async handleSignUp({ email, password }) {
    // create user
    const user = this.store.createRecord('user', { email, password });
    await user.save();

    // sign in
    this.store.unloadAll('user');
    await this.session.authenticate('authenticator:oauth', email, password);

    // navigate to available todos
    this.send('refreshApplicationModel');
    this.router.transitionTo('todos.available');
  }
}
