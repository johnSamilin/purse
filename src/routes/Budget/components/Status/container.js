// @ts-check
import { Component } from 'react';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';
import { userStatuses, decisions } from '../../const';
import { Database } from '../../../../database';

export class Status extends Component {
  constructor(props) {
    super(props);
    this.requestMembership = this.requestMembership.bind(this);
    this.respondInvite = this.respondInvite.bind(this);
  }

  requestMembership() {
    const currentUserId = GlobalStore.modules.users.activeUser.value.id;
    const currentBudget = GlobalStore.modules.budgets.activeBudget.value;
    let found = false;
    const users = currentBudget.users.map((u) => {
      if (u.id === currentUserId) {
        found = true;
        return {
          ...u,
          status: userStatuses.pending,
        };
      }
      return u;
    });
    if (!found) {
      users.push({
        id: currentUserId,
        status: userStatuses.pending,
      });
    }
    
    currentBudget.set('users', users);
    currentBudget.save();
  }

  respondInvite(isAccepted = false) {
    const currentUserId = GlobalStore.modules.users.activeUser.value.id;
    const currentBudget = GlobalStore.modules.budgets.activeBudget.value;
    const users = currentBudget.users.map((u) => {
      if (u.id === currentUserId) {
        return {
          ...u,
          status: isAccepted ? userStatuses.active : userStatuses.removed,
          decision: decisions.pending,
        };
      }
      return u;
    });
    
    currentBudget.set('users', users);
    currentBudget.save();
  }

  render() {
    return presenter({
      ...this.props,
      requestMembership: this.requestMembership,
      respondInvite: this.respondInvite,
    });
  }
}
