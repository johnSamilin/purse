// @ts-check
import { Component } from 'react';
import get from 'lodash/get';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';
import { budgetStates } from '../../../../const';

export class Collaborators extends Component {
  constructor(params) {
    super(params);
    this.state = {
      collaborators: [],
      canManage: false,
    };
    this.changeUserStatus = this.changeUserStatus.bind(this);
  }

  componentWillMount() {
    this.budgetSub = GlobalStore.modules.budgets.activeBudget.subscribe(() => this.setCollaborators());
    this.usersSub = GlobalStore.users.subscribe(() => this.setCollaborators());
  }

  componentWillUnmount() {
    GlobalStore.modules.budgets.activeBudget.unsubscribe(this.budgetSub);
    GlobalStore.users.unsubscribe(this.usersSub);
  }

  setCollaborators() {
    const budget = GlobalStore.modules.budgets.activeBudget.value;
    if (!budget) {
      return false;
    }
    let collaborators = [];
    if (GlobalStore.modules.budgets.activeBudget.value) {
      collaborators = GlobalStore.modules.budgets.activeBudget.value.users
        .map(user => ({
          ...user,
          ...GlobalStore.users.value.get(user.id),
        }));
    }
    const isOwner = budget.ownerId === get(GlobalStore.modules.users.activeUser.value, 'id');

    this.setState({
      collaborators,
      canManage: isOwner && budget.state === budgetStates.opened,
    });
  }

  changeUserStatus(user, nextStatus) {
    const budget = GlobalStore.modules.budgets.activeBudget.value;
    const users = budget.users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: nextStatus,
        };
      }

      return u;
    });

    budget.users = users;
    budget.save();
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      changeUserStatus: this.changeUserStatus,
    });
  }
}
