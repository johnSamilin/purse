// @ts-check
import { Component } from 'react';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';
import { userStatuses } from '../../const';

export class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      note: '',
      collaborators: new Map(),
      users: [],
    };
    this.changeAmount = this.changeAmount.bind(this);
    this.changeNote = this.changeNote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleAllUsers = this.toggleAllUsers.bind(this);
    this.toggleUser = this.toggleUser.bind(this);
  }

  componentWillMount() {
    this.flush();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.usersList) {
      const users = nextProps.usersList
        .filter(user => user.id !== GlobalStore.modules.users.activeUser.value.id)
        .filter(user => user.status === userStatuses.active)
        .map(user => GlobalStore.users.value.get(user.id));
      
      this.setState({
        users,
      });
    }
  }

  flush() {
    this.setState({
      amount: '',
      note: '',
      collaborators: new Map(),
    });
  }

  changeAmount(e) {
    this.setState({
      amount: parseFloat(e.target.value),
    });
  }

  changeNote(e) {
    this.setState({
      note: e.target.value,
    });
  }

  toggleAllUsers() {
    this.setState({
      collaborators: new Map(),
    });
  }

  toggleUser(user) {
    this.setState((state) => {
      const collaborators = state.collaborators;
      collaborators.has(user.id)
        ? collaborators.delete(user.id)
        : collaborators.set(user.id, user);
      
      return {
        ...state,
        collaborators,
      };
    });
  }
  
  onSubmit(e) {
    e.preventDefault();
    const collaborators = Array.from(this.state.collaborators)
      .map(([id, user]) => ({ id }));

    this.props.onAdd(this.state.amount, this.state.note, collaborators);
    this.flush();
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      changeAmount: this.changeAmount,
      changeNote: this.changeNote,
      onSubmit: this.onSubmit,
      toggleAllUsers: this.toggleAllUsers,
      toggleUser: this.toggleUser,
    });
  }
}
