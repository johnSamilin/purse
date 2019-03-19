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

    // TODO: fix possible memory leak
    GlobalStore.budgets.subscribe(() => this.setBudgetsList());
    GlobalStore.transactions.subscribe(() => this.setBudgetsList());
    GlobalStore.seentransactions.subscribe(() => this.setBudgetsList());
    GlobalStore.modules.budgets.activeBudget.subscribe(activeBudget => this.setActiveBudget(activeBudget));
    
    let userInfo;
    const isOffline = GlobalStore.modules.status.isOffline.value;
    const token = GlobalStore.modules.auth.token.value;
    try {
      if (!isOffline) {
        userInfo = await Database.getSession('+7test-user', token);
      }
      userInfo = await Database.logInLocal(token);
      usersActions.setActiveUser(userInfo);
      this.setActiveUser(userInfo);
      Database.startSync();
    } catch(er) {
      notify(er.message);
      this.logout();
    } 
    this.setIsLoading(false);
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
    this.setState(getBudgets());
  }

  getUserInfo(token) {
    return Database.instance.collections.users.find().where({ token }).exec();    
  }

  logout() {
    usersActions.setActiveUser(null);
    Database.stopSession();
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
