import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { logRuntimeError } from 'surely/utils';

export default class SignUpFormComponent extends Component {
  @service store;
  @service session;

  @tracked email;
  @tracked password;
  @tracked passwordConfirmation;
  @tracked errorMessage = null;
  @tracked errors = {};

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
      logRuntimeError(e);
      this.errorMessage =
        e?.responseJSON?.error_description ??
        e?.message ??
        'An error occurred while signing up.';
    }
  }

  @action
  handleCancel() {
    this.args.onCancel();
  }

  validate() {
    let isValid = true;
    const errors = {};
    if (!this.email) {
      isValid = false;
      errors.email = 'This is required.';
    }
    if (!this.password) {
      isValid = false;
      errors.password = 'This is required.';
    }
    if (!this.passwordConfirmation) {
      isValid = false;
      errors.passwordConfirmation = 'This is required.';
    }
    this.errors = errors;

    if (this.passwordConfirmation !== this.password) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return isValid;
  }
}
