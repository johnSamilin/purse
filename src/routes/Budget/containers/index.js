// @ts-check
import { Component } from 'react';
import { withRouter } from 'react-router';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import presenter from '../components';
import { paths, userStatuses, path } from '../const';
import { Database } from '../../../database';
import { GlobalStore } from '../../../store/globalStore';
import { Page } from '../../../providers/Page';
import { budgetsActions } from '../../../modules/budgets/actions';
import { logger, notify } from '../../../services/helpers';
import difference from 'lodash/difference';

@withRouter
class Budget extends Page {
  constructor(props) {
    super(props);
    this.state = {
      budget: undefined,
      transactions: [],
      newUsersCount: 0,
      currentUserStatus: userStatuses.none,
      usersList: [],
      isLoading: false,
      activeUserIds: new Set(),
    };
    this.path = path;
    this.showSettings = this.showSettings.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
  }
  
  componentWillMount() {
    super.componentWillMount();
    this.usersSub = GlobalStore.users.subscribe(() => this.setUsersList());
    this.budgetSub = GlobalStore.modules.budgets.activeBudget.subscribe((budget) => {
      if (!budget) {
        this.unload();
        return false;
      }
      this.selectBudget(budget);
      this.setUsersList();
    });

    if (this.props.router.params.id) {
      Database.isReady.once((isReady) => {
        if (isReady) {
          this.loadBudget(this.props.router.params.id);
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    // TODO: fix router
    if (this.props.router.params.id && !newProps.router.params.id) {
      this.unload();
    }
  }

  componentWillUnmount() {
    GlobalStore.modules.budgets.activeBudget.unsubscribe(this.budgetSub);
    this.unload();
  }

  unload() {
    if (this.transactionsSubRx) {
      this.transactionsSubRx.unsubscribe();
    }
    GlobalStore.users.unsubscribe(this.usersSub);
    this.setState({
      budget: undefined,
    });
  }

  setLoading(isLoading) {
    this.setState({
      isLoading,
    });
  }

  setUsersList() {
    const rawBudget = this.state.budget;
    if (!rawBudget) {
      return false;
    }
    const rawList = rawBudget.users ? rawBudget.users : [];
    const usersList = rawList;

    const newUsersCount = usersList.filter(user => [
        userStatuses.pending,
        userStatuses.invited,
      ].includes(user.status)
    ).length;

    this.setState({
      usersList,
      newUsersCount,
    });    
  }

  selectBudget(budget) {
    const isOwner = budget.ownerId === GlobalStore.modules.users.activeUser.value.id;
    let currentUserStatus = userStatuses.none;
    if (isOwner) {
      currentUserStatus = userStatuses.active;
    } else {
      const user = budget.users.find(user => user.id === GlobalStore.modules.users.activeUser.value.id);
      if (user) {
        currentUserStatus = user.status;
      }
    }
    const activeUserIds = new Set();
    budget.users.forEach(user => {
      if (user.status === userStatuses.active) {
        activeUserIds.add(user.id);
      }
    });
    this.setState({
      budget,
      currentUserStatus,
      activeUserIds,
    });

    this.transactionsQuery = Database.instance.collections.transactions.find().where({ budgetId: budget.id });
    this.transactionsSubRx = this.transactionsQuery.$.subscribe((transactions) => {
      if (transactions) {
        this.setTransactions(transactions);
        this.updateSeenTransactions(transactions.length);
      }
    });
    this.transactionsQuery
      .exec()
      .then(transactions => this.setTransactions(transactions));
  }

  setTransactions(transactions = []) {
    const transactionsSorted = sortBy(transactions, transaction => transaction.date);
    this.setState({
      transactions: transactionsSorted.reverse(),
    });
  }

  async updateSeenTransactions(count) {
    const budget = await Database.instance.collections.seentransactions.findOne(this.state.budget.id).exec();
    if (budget === null) {
      Database.instance.collections.seentransactions.insert({
        budgetId: this.state.budget.id,
        transactions: count,
      });
    } else {
      budget.transactions = count;
      budget.save();
    }
  }

  async loadBudget(id) {
    this.setLoading(true);
    const budgetsQuery = Database.instance.collections.budgets.findOne(id);
    const budgetDocument = await budgetsQuery.exec();
    if (budgetDocument) {
      this.setLoading(false);
      GlobalStore.modules.budgets.activeBudget.value = budgetDocument;
    } else {
      this.loadBudgetExternal(id);
    }
  }

  async loadBudgetExternal(id) {
    this.setLoading(true);
    try {
      const remoteBudget = await budgetsActions.getBudgetFromServer(id);
      GlobalStore.modules.budgets.activeBudget.value = remoteBudget;
    } catch (er) {
      logger.error(er);
      notify('Не удалось загрузить данные');
    }
    this.setLoading(false);
  }

  addTransaction(amount, note, collaborators, isPaidByOwner = false) {
    const currentUserId = GlobalStore.modules.users.activeUser.value.id;
    this.transactionsQuery.collection.insert({
      id: `${currentUserId}_${Date.now().toString()}`,
      budgetId: this.state.budget.id,
      amount: parseFloat(amount),
      date: Date.now().toString(),
      note,
      cancelled: false,
      ownerId: currentUserId,
      isSynced: false,
      collaborators,
      isPaidByOwner,
    });
  }

  showSettings() {
    this.props.router.push(paths.settings(this.state.budget.id));
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      getPageClasses: this.getPageClasses,
      showSettings: this.showSettings,
      addTransaction: this.addTransaction,
    });
  }
}

export {
  Budget,
};
