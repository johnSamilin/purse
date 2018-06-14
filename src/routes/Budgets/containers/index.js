import { Database } from 'database';
import { budgetStates } from 'const';
import presenter from '../components';
import { logger, notify } from '../../../services/helpers';
import { GlobalStore } from '../../../store/globalStore';
import { actions } from '../../../modules/auth/actions';
import { usersActions } from '../../../modules/users/actions';
import { Page } from '../../../providers/Page';
import { namespace } from '../const';
import { budgetsActions } from '../modules/actions';
import { getBudgets } from '../modules/selectors';

export class Budgets extends Page {
  constructor() {
    super();
    this.state = {
      ...super.state,
      isLoading: false,
      userInfo: {},
      activeList: [],
      pendingAttentionList: [],
      activeId: -1, // TODO: get from route
    };
    this.namespace = namespace;

    this.requestClosing = this.requestClosing.bind(this);
    this.openBudget = this.openBudget.bind(this);
    this.deleteBudget = this.deleteBudget.bind(this);
  }

  async componentDidMount() {
    this.setIsLoading(true);
    const token = GlobalStore.modules.auth.token.value;
    // когда только что залогинились
    await Database.syncUsers();
    Database.usersSync.complete$.subscribe((isComplete) => {
      if (isComplete !== false) {
        this.getUserInfo(token);
      }
    });

    // TODO: fix possible memory leak
    GlobalStore.modules.users.activeUser.subscribe((userInfo) => {
      this.setActiveUser(userInfo);
    });
    GlobalStore.budgets.subscribe(() => this.setBudgetsList());
    GlobalStore.transactions.subscribe(() => this.setBudgetsList());
    GlobalStore.seentransactions.subscribe(() => this.setBudgetsList());
  }

  setActiveUser(userInfo) {
    this.setState({
      userInfo,
    });
  }

  setIsLoading(isLoading) {
    this.setState({
      isLoading,
    });
  }

  async getUserInfo(token) {
    const users = await Database.instance.users.find().where({ token }).exec();
    console.tlog('get user info', token, users)
    this.setIsLoading(false);
    users[0]
        ? usersActions.setActiveUser(users[0])
        : this.logout();
  }

  logout() {
    usersActions.setActiveUser(null);
    actions.logout();
  }

  setBudgetsList() {
    console.tlog('set budgets list started');    
    this.setState(getBudgets());
    console.tlog('set budgets list ended');
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

  openBudget(id) {
    const budgetQuery = Database.instance.budgets.findOne(id);
    budgetQuery.exec().then((budget) => {
      budget.state = budgetStates.opened;
      budget.save();
    });
  }

  deleteBudget(id) {
    const budgetQuery = Database.instance.budgets.findOne(id);
    budgetQuery.exec().then((budget) => {
      budget.remove();
    });
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
