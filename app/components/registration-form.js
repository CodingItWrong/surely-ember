import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RegistrationFormComponent extends Component {
  @service store;

  @tracked email;
  @tracked password;
  @tracked passwordConfirmation;
  @tracked errorMessage = null;

  @action
  async register() {
    if (!this.validate()) {
      return;
    }

    const user = this.store.createRecord('user', {
      email: this.email,
      password: this.password,
    });

    try {
      await user.save();
      this.args.onRegister();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.errorMessage =
        e?.responseJSON?.error_description ??
        e?.message ??
        'An error occurred while registering.';
    }
  }

  validate() {
    if (!this.email) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.passwordConfirmation !== this.password) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }
}
