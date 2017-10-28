import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import { database } from 'database';
import { notify } from 'services/helpers';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';

class Collaborators extends Component {
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
    const collaboratorsQuery = database
        .collections
        .budgets
        .findOne(this.props.id);
    collaboratorsQuery.exec()
        .then((budget) => {
            this.budget = budget;
            if (this.subscription) {
                this.clearCollaborators();
            }
            this.subscription = budget.$.subscribe(this.onBudgetUpdated);
        });
  }
  
  changeUserStatus(user, nextStatus) {
    this.budget.users = this.budget.users.map(u => {
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

const mapDispatchToProps = {
    
}

const mapStateToProps = (state, ownProps) => {
    const budget = get(state, 'budget.data');
    const users = get(state, 'users.data') || [];
    const userId = get(state, 'auth.data.id', -1);
    const ownerId = get(budget, 'ownerId');
    const isOwner = ownerId === userId;
    const canManage = isOwner && budget.state === 'opened';

    return {
        ...budget,
        users: get(budget, 'users', []).map(user => ({
            ...user,
            ...users.filter(u => u.id === user.id)[0],
        })),
        isActive: state.modules.active === 'collaborators',
        isNext: state.modules.next.includes('collaborators'),
        ownerId,
        canManage,
    }
}

function mergeProps(state, dispatch, own) {
  return {
    ...state,
    ...dispatch,
    ...own,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Collaborators))
