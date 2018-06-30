import React, { Component } from 'react';
import { withRouter } from 'react-router';
import get from 'lodash/get';
import { Database } from 'database';
import { notify } from 'services/helpers';
import presenter from '../components';

export class Collaborators extends Component {
  constructor() {
    super();
    this.changeUserStatus = this.changeUserStatus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      if (nextProps.id) {
        this.loadCollaborators(nextProps.id);
      } else {
        this.clearCollaborators();
      }
    }
  }

  loadCollaborators(budgetId) {
    const collaboratorsQuery = Database.instance
        .collections
        .budgets
        .findOne(budgetId);
    collaboratorsQuery.exec()
        .then((budget) => {
          this.budget = budget;
          if (this.subscription) {
            this.clearCollaborators();
          }
          this.subscription = budget.$.subscribe(budget => this.loadCollaborators(budget.id));
        });
  }

  changeUserStatus(user, nextStatus) {
    this.budget.users = this.budget.users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: nextStatus,
        };
      }

      return u;
    });

    this.budget.save();
  }

  clearCollaborators() {
    this.subscription.unsubscribe();
  }

  render() {
    return presenter({
      ...this.props,
      changeUserStatus: this.changeUserStatus,
    });
  }
}

// const mapDispatchToProps = {

// };

// const mapStateToProps = (state, ownProps) => {
//   const budget = get(state, 'budget.data');
//   const users = get(state, 'users.data') || [];
//   const userId = get(state, 'auth.data.userInfo.id', -1);
//   const ownerId = get(budget, 'ownerId');
//   const isOwner = ownerId === userId;
//   const canManage = isOwner && budget.state === 'opened';

//   return {
//     ...budget,
//     users: get(budget, 'users', []).map(user => ({
//       ...user,
//       ...users.filter(u => u.id === user.id)[0],
//     })),
//     isActive: state.modules.active === 'collaborators',
//     isNext: state.modules.next.includes('collaborators'),
//     ownerId,
//     canManage,
//   };
// };

// function mergeProps(state, dispatch, own) {
//   return {
//     ...state,
//     ...dispatch,
//     ...own,
//   };
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Collaborators));
