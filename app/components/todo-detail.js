import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TodoDetailComponent extends Component {
  @action
  async complete() {
    const { todo } = this.args;
    todo.completedAt = new Date();
    await todo.save();
  }

  @action
  async uncomplete() {
    const { todo } = this.args;
    todo.completedAt = null;
    await todo.save();
  }

  @action
  async delete() {
    const { todo } = this.args;
    todo.deletedAt = new Date();
    await todo.save();
  }

  @action
  async undelete() {
    const { todo } = this.args;
    todo.deletedAt = null;
    todo.completedAt = null;
    await todo.save();
  }

  @action
  defer() {
    // eslint-disable-next-line no-console
    console.log('todo: defer');
  }
}
