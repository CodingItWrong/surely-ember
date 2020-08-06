import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SignUpFormComponent extends Component {
  @service store;
  @service session;

  @tracked email;
  @tracked password;
  @tracked passwordConfirmation;
  @tracked errorMessage = null;

  @action
  async signUp() {
    if (!this.validate()) {
      return;
    }

    const { email, password } = this;
    const { signUp } = this.args;

    try {
      await signUp({ email, password });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.errorMessage =
        e?.responseJSON?.error_description ??
        e?.message ??
        'An error occurred while signing up.';
    }
  }

  validate() {
    if (this.passwordConfirmation !== this.password) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }
}
