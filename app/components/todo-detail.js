import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TodoDetailComponent extends Component {
  @action
  complete() {
    const { todo } = this.args;
    todo.completedAt = new Date();
    todo.save();
  }

  @action
  uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;
    todo.save();
  }

  @action
  delete() {
    const { todo } = this.args;
    todo.deletedAt = new Date();
    todo.save();
  }

  @action
  undelete() {
    const { todo } = this.args;
    todo.deletedAt = null;
    todo.completedAt = null;
    todo.save();
  }

  @action
  defer() {
    // eslint-disable-next-line no-console
    console.log('todo: defer');
  }
}
