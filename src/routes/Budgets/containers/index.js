import { Component } from 'react';
import { connect } from 'react-redux';
import { Database } from 'database';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import authModule from 'modules/auth';
import { budgetStates } from 'const';
import { actions as authActions } from 'modules/auth/actions';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { logger, notify } from '../../../services/helpers';

class Budgets extends Component {

  async componentDidMount() {
    const token = authModule.getToken();
    // когда только что залогинились
    await Database.syncUsers();
    Database.usersSync.complete$.subscribe(() => this.getUserInfo(token));
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.isLoading === false && nextProps.isLoading === true) {
      this.props.showLoader();
    }
    if ((this.props.userInfo.id !== nextProps.userInfo.id) ||
      !isEqual(this.props.availableBudgets, nextProps.availableBudgets)) {
      if (Database.isSyncing) {
        await Database.stopSync();
      }
      Database.startSync({
        userId: nextProps.userInfo.id,
        budgetIds: nextProps.availableBudgets,
      });
    }
  }

  componentWillUnmount() {
    Database.stopSync();
  }

  async getUserInfo(token) {
    const users = await Database.instance.users.find().where({ token }).exec();
    users[0]
        ? this.props.dispatchUser(users[0])
        : this.props.logout();
  }

  render() {
    return presenter(this.props);
  }
}

const mapDispatchToProps = {
  showLoader: actions.requestStarted,
  hideLoader: actions.requestFulfilled,
  logout: authActions.logout,
  dispatchUser: authActions.dispatch,
  requestClosing: actions.requestClosing,
};

function mapStateToProps(state) {
  const isLoading = get(state, 'budgets.isLoading', false);
  const userInfo = select.userInfo(state);
  const availableBudgets = select.availableBudgets(state);// for syncing
  const activeList = select.listActive(state);
  const pendingAttentionList = select.listClosing(state);

  return {
    activeList,
    pendingAttentionList,
    activeId: select.active(state),
    isActive: state.modules.active === 'budgets',
    isNext: state.modules.next.includes('budgets'),
    isLoading,
    userInfo,
    availableBudgets,
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    requestClosing(id) {
      const promise = dispatchProps.requestClosing(id);
      promise.catch((error) => {
        logger.error(error);
        notify('Не удалось закрыть бюджет. Проверьте соединение с сетью');
        dispatchProps.hideLoader();
      });

      return promise;
    },
    openBudget(id) {
      const budgetQuery = Database.instance.budgets.findOne(id);
      budgetQuery.exec().then((budget) => {
        budget.state = budgetStates.opened;
        budget.save();
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets);
