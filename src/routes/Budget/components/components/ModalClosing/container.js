import { Component } from 'react';
import { budgetStates } from 'const';
import { Database } from 'database';
import presenter from './presenter';
import { GlobalStore } from '../../../../../store/globalStore';
import { decisions, userStatuses } from '../../../const';

export class ModalClosing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillMount() {   
    this.makeDecision = this.makeDecision.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const globalUsers = GlobalStore.users.value;
    const users = nextProps.usersList
      .filter(user => user.status === userStatuses.active)
      .map((user) => {
        const userInfo = globalUsers.get(user.id) || {};
        return {
          ...user,
          ...userInfo,
        };
      });
    this.setState({
      users,
    });
  }
  
  updateDecision(user, decision) {
    return {
      ...user,
      decision: user.id === GlobalStore.modules.users.activeUser.value.id
        ? decision
        : user.decision,
    };
  }

  makeDecision(decision) {
    const budget = GlobalStore.modules.budgets.activeBudget.value;
    let users = budget.users.map(user => this.updateDecision(user, decision));
    let isRejected = false;
    let isApproved = true;
    users.reduce((prev, next) => {
      if (next.decision === decisions.rejected) {
        isRejected = true;
      }
      if (next.decision !== decisions.approved) {
        isApproved = false;
      }
    });

    if (isRejected) {
      // TODO: в бэк отправить
      budget.state = budgetStates.opened;
      users = users.map(user => this.updateDecision(user, decisions.pending));
    } else if (isApproved) {
      budget.state = budgetStates.closed;
    }

    budget.users = users;
    budget.save();
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      makeDecision: this.makeDecision,
    });
  }
}

