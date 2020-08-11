import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { logRuntimeError } from 'surely/utils';

export default class SignInFormComponent extends Component {
  @service session;
  @service router;

  email = '';
  password = '';

  @tracked
  errorMessage = '';

  @action
  goToSignUp() {
    this.router.transitionTo('user.new');
  }

  @action
  async signIn() {
    let { email, password } = this;

    try {
      await this.session.authenticate('authenticator:oauth', email, password);

      this.args.onSignedIn();
    } catch (e) {
      logRuntimeError(e);
      this.errorMessage =
        e?.responseJSON?.error_description ??
        e?.message ??
        'An error occurred while signing in.';
    }
  }
}
