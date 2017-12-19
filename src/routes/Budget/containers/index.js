import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { get, sortBy } from 'lodash';
import { Database } from 'database';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { userStatuses, paths } from '../const';

class Budget extends Component {
  constructor() {
    super();
    this.requestMembership = this.requestMembership.bind(this);
    this.toggleTransactionState = this.toggleTransactionState.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
    this.changeUserStatus = this.changeUserStatus.bind(this);
    this.respondInvite = this.respondInvite.bind(this);

    this.onTransactionsUpdated = this.onTransactionsUpdated.bind(this);
    this.onBudgetUpdated = this.onBudgetUpdated.bind(this);
    this.unload = this.unload.bind(this);
  }

  componentWillUnmount() {
    this.unload();
  }

  componentWillReceiveProps(newProps) {
    if(this.props.id !== newProps.id) {
      if (newProps.id) {
        this.loadBudget(newProps.id);
      } else {
        this.props.clearBudget();
        this.props.clearTransactions();
      }
      return;
    }

    if (this.props.budgetsLoading === true && newProps.budgetsLoading === false) {
      if (newProps.id) {
        this.loadBudget(newProps.id);
      }
    }
  }

  loadBudget(id) {
    const budgetsQuery = Database.instance.budgets.findOne(id);
    budgetsQuery.exec()
      .then((b) => {        
        this.isLoaded = true;
        this.budgetDocument = b;
        if (this.budgetSub) {
          this.budgetSub.unsubscribe();
        }
        this.budgetSub = b.$.subscribe(this.onBudgetUpdated);

        this.transactionsQuery = Database.instance.transactions
          .find()
          .where({ budgetId: id });
        this.transactionsSub = this.transactionsQuery.$.subscribe((transactions) => {
          if (transactions) {
            this.onTransactionsUpdated(transactions);
            this.updateSeenTransactions(transactions.length);
          }
        });
        this.transactionsQuery
          .exec()
          .then(this.onTransactionsUpdated);
      });
    budgetsQuery.$.subscribe((event) => {
      if (Array.isArray(event)) {
        this.onBudgetUpdated(event[0]);
      }
    });
  }

  unload() {
    try {
      this.budgetSub.unsubscribe();
      this.transactionsSub.unsubscribe();
    } catch(er) {
      // ignore
      console.error(er);
    }
    this.isLoaded = false;
  }

  onBudgetUpdated(budget) {
    this.props.selectBudget(budget);
  }

  onTransactionsUpdated(transactions) {
    const transactionsSorted = sortBy(transactions, transaction => transaction.date);
    this.props.selectTransactions(transactionsSorted.reverse());
  }

  requestMembership() {
    if (this.props.id) {
      let found = false;
      const users = this.budgetDocument.users.map((u, i) => {
        if (u.id === this.props.currentUserId) {
          found = true;
          return {
            ...u,
            status: 'pending',
          }
        }
        return u;
      });
      if (!found) {
        users.push({
          id: this.props.currentUserId,
          status: 'pending',
        });
      }
      this.budgetDocument.users = users;
      this.budgetDocument.save();
    }
  }

  respondInvite(isAccepted = false) {
    const users = this.budgetDocument.users.map((u, i) => {
      if (u.id === this.props.currentUserId) {
        return {
          ...u,
          status: isAccepted ? 'active' : 'removed',
        }
      }
      return u;
    });
    this.budgetDocument.users = users;
    this.budgetDocument.save();
  }

  toggleTransactionState(id) {
    const transaction = this.props.transactions.filter(t => t.id === id)[0];
    if (!transaction || transaction.ownerId != this.props.currentUserId || this.props.status !== 'active') {
      return false;
    }
    if (transaction.cancelled || confirm('Удалить? Точно')) {
      transaction.cancelled = !transaction.cancelled;
      transaction.save();
    }
  }
  
  changeUserStatus(user, newStatus) {
    let updatedUsers = this.budgetDocument.users;
    if (newStatus === '') {
      // revoked invite
      updatedUsers = updatedUsers.filter(u => u.id !== user.id);
    }
    updatedUsers = updatedUsers.map(u => {
      if (u.id === user.id) {
        u.status = newStatus;
      }
      return u;
    });
    this.budgetDocument.users = updatedUsers;
    this.budgetDocument.save();
  }

  addTransaction(amount, note) {
    this.transactionsQuery.collection.insert({
      id: `${this.props.currentUserId}_${Date.now().toString()}`,
      budgetId: this.props.budget.id,
      amount: parseFloat(amount),
      date: Date.now().toString(),
      note,
      cancelled: false,
      ownerId: this.props.currentUserId,
    });
  }

  updateSeenTransactions(count) {
    const query = Database.instance.seentransactions
      .findOne(this.props.id);
    query.exec()
      .then((budget) => {
        if (budget === null) {
          Database.instance.seentransactions.insert({
            budgetId: this.props.id,
            transactions: count,
          });
          return;
        }
        budget.transactions = count;
        budget.save();
      });
  }

  render() {
    return presenter({
      ...this.props,
      requestMembership: this.requestMembership,
      toggleTransactionState: this.toggleTransactionState,
      addTransaction: this.addTransaction,
      changeUserStatus: this.changeUserStatus,
      respondInvite: this.respondInvite,
    });
  }
}

const mapDispatchToProps = {
  selectBudget: actions.budget.select,
  update: actions.budget.update,
  loadTransactions: actions.transactions.load,
  selectTransactions: actions.transactions.select,
  // loadBudget: actions.budget.load,
  clearTransactions: actions.transactions.clear,
  clearBudget: actions.budget.clear,
  redirect: push,
}

const mapStateToProps = (state, ownProps) => {
  const budget = select.budget(state);
  const transactions = select.transactions(state);
  const usersList = select.users(state);
  const currentUserId = get(state, 'auth.data.userInfo.id', -1);
  let status = 'none';  
  const isOwner = budget.ownerId === currentUserId;
  if (isOwner) {
    status = 'active';
  } else {
    budget.users && budget.users.forEach((user) => {
      if (user.id === currentUserId) {
        status = user.status;
      }
    });
  }
  const budgetsLoading = get(state, 'budgets.isLoading', false);
  const newUsersCount = usersList.filter(user => ['pending', 'invited'].includes(user.status)).length;

  return {
    id: ownProps.params.id,
    budget,
    isActive: state.modules.active === 'budget',
    isNext: state.modules.next.includes('budget'),
    currentUserId,
    transactions,
    status,
    usersList,
    isOwner,
    budgetsLoading,
    newUsersCount,
  }
}

function mergeProps(state, dispatch, own) {
  return {
    ...state,
    ...dispatch,
    ...own,
    showCollaborators() {
      dispatch.redirect(paths.collaborators(state.id));
    },
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budget))
