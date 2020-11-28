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
  cancel() {
    this.args.onCancel();
  }

  @action
  async signUp(e) {
    e.preventDefault();

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

  validate() {
    const errors = {};
    if (!this.email) {
      errors.email = 'This is required.';
    }
    if (!this.password) {
      errors.password = 'This is required.';
    }
    if (!this.passwordConfirmation) {
      errors.passwordConfirmation = 'This is required.';
    } else if (this.passwordConfirmation !== this.password) {
      errors.passwordConfirmation = 'Passwords do not match';
    }

    this.errors = errors;

    const isValid = Object.keys(errors).length === 0;
    return isValid;
  }
}
