// @ts-check
import { Component } from 'react';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';

export class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: new Map(),
    };
    this.onTransactionClick = this.onTransactionClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      const users = new Map();
      GlobalStore.users.value.forEach(user => users.set(user.id, user));

      this.setState({
        users,
      });
    }
  }

  onTransactionClick(doc) {
    if (
      this.props.canBeDeleted
      && doc.ownerId === GlobalStore.modules.users.activeUser.value.id
    ) {
      if (doc.cancelled || confirm('Удалить? Точно')) {
        doc.cancelled = !doc.cancelled;
        doc.save();
      }
    }
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      onTransactionClick: this.onTransactionClick,
    });
  }
}

