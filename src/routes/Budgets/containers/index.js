// @ts-check
import { budgetStates } from '../../../const';
import { Database } from '../../../database';
import { actions } from '../../../modules/auth/actions';
import { budgetsActions } from '../../../modules/budgets/actions';
import { getBudgets } from '../../../modules/budgets/selectors';
import { usersActions } from '../../../modules/users/actions';
import { logger, notify } from '../../../services/helpers';
import { GlobalStore } from '../../../store/globalStore';
import presenter from '../components';
import { path } from '../const';
import { Page } from '../../../providers/Page';

export class Budgets extends Page {
  constructor(params) {
    super(params);
    this.state = {
      ...super.state,
      isLoading: false,
      userInfo: {},
      activeList: [],
      pendingAttentionList: [],
      activeBudget: null,
    };
    this.path = path;

    this.requestClosing = this.requestClosing.bind(this);
    this.openBudget = this.openBudget.bind(this);
    this.deleteBudget = this.deleteBudget.bind(this);
  }

  async componentDidMount() {
    this.setIsLoading(true);
    const token = GlobalStore.modules.auth.token.value;
    if (GlobalStore.modules.status.isOffline.value) {
      this.getUserInfo(token);
    } else {
      // когда только что залогинились
      await Database.syncUsers();
      let isUserInfoLoaded = false;
      Database.usersSync.complete$.subscribe((isComplete) => {
        if (isComplete !== false && !isUserInfoLoaded) {
          isUserInfoLoaded = true;
          this.getUserInfo(token);
        }
      });
    }

    // TODO: fix possible memory leak
    GlobalStore.modules.users.activeUser.subscribe(userInfo => this.setActiveUser(userInfo));
    GlobalStore.budgets.subscribe(() => this.setBudgetsList());
    GlobalStore.transactions.subscribe(() => this.setBudgetsList());
    GlobalStore.seentransactions.subscribe(() => this.setBudgetsList());
    GlobalStore.modules.budgets.activeBudget.subscribe(activeBudget => this.setActiveBudget(activeBudget));
  }

  setActiveUser(userInfo) {
    this.setState({
      userInfo,
    });
  }

  setActiveBudget(activeBudget) {
    this.setState({
      activeBudget,
    });
  }

  setIsLoading(isLoading) {
    this.setState({
      isLoading,
    });
  }

  setBudgetsList() {
    console.tlog('set budgets list started');    
    this.setState(getBudgets());
    console.tlog('set budgets list ended');
  }

  async getUserInfo(token) {
    console.tlog('get user info', token, users)
    const users = await Database.instance.collections.users.find().where({ token }).exec();
    this.setIsLoading(false);
    users[0]
        ? usersActions.setActiveUser(users[0])
        : this.logout();
  }

  logout() {
    usersActions.setActiveUser(null);
    actions.logout();
  }

  requestClosing(id) {
    this.setIsLoading(true);
    const promise = budgetsActions.requestClosing(id);
    promise.catch((error) => {
      logger.error(error);
      notify('Не удалось закрыть бюджет. Проверьте соединение с сетью');
    })
    .finally(() => this.setIsLoading(false));

    return promise;
  }

  openBudget(doc) {
    doc.state = budgetStates.opened;
    doc.save();
  }

  deleteBudget(doc) {
    doc.remove();
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      getPageClasses: this.getPageClasses,
      logout: this.logout,
      requestClosing: this.requestClosing,
      openBudget: this.openBudget,
      deleteBudget: this.deleteBudget,
    });
  }
}
