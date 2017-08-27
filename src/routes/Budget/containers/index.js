import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { get, sortBy } from 'lodash';
import { database } from 'database';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { userStatuses } from '../const';

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
    }
  }

  loadBudget(id) {
    const budgetsQuery = database.budgets.findOne(id);
    budgetsQuery.exec()
      .then((b) => {        
        this.isLoaded = true;
        this.budgetDocument = b;
        if (this.budgetSub) {
          this.budgetSub.unsubscribe();
        }
        this.budgetSub = b.$.subscribe(this.onBudgetUpdated);

        this.transactionsQuery = database.transactions
          .find()
          .where({ budgetId: id });
        this.transactionsSub = this.transactionsQuery.$.subscribe((transactions) => {
          if (transactions) {
            this.onTransactionsUpdated(transactions);
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
    }
    this.isLoaded = false;
  }

  onBudgetUpdated(budget) {
    this.props.selectBudget(budget);
  }

  onTransactionsUpdated(transactions) {
    const ids = new Set();
    transactions.forEach(transaction => ids.add(transaction.ownerId));
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
      this.budgetDocument.save().then(() => {}).catch((er) => {});
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
    this.budgetDocument.save().then(() => {}).catch((er) => {});
  }

  toggleTransactionState(id) {
    const transaction = this.props.transactions.filter(t => t.id === id)[0];
    if (!transaction || transaction.ownerId != this.props.currentUserId || this.props.status !== 'active') {
      return false;
    }
    if (transaction.cancelled || confirm('Удалить? Точно')) {
      transaction.cancelled = !transaction.cancelled;
      transaction.save().catch(() => {});
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
    this.budgetDocument.save().catch(() => {});
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
}

const mapStateToProps = (state, ownProps) => {
  const budget = select.budget(state);
  const transactions = select.transactions(state);
  const usersList = select.users(state);
  const currentUserId = get(state, 'auth.data.id', -1);
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
  }
}

function mergeProps(state, dispatch, own) {
  return {
    ...state,
    ...dispatch,
    ...own,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budget))
