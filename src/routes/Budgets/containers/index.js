import { Component } from 'react';
import { connect } from 'react-redux';
import { Database } from 'database';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import authModule from 'modules/auth';
import { actions as authActions } from 'modules/auth/actions';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';

class Budgets extends Component {

  async componentDidMount() {
    const token = __DEV__ ? null : authModule.getToken();
    // когда только что залогинились
    await Database.syncUsers();
    const completeEvent = Database.usersSync.complete$;
    // обрабатываем ситуацию, когда токен уже есть
    completeEvent.subscribe((e) => {
      if (get(e, 'pull.status') === 'complete') {
        this.getUserInfo(token);
      }
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.isLoading === false && nextProps.isLoading === true) {
      this.props.loadBudgets();
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
  loadBudgets: actions.load,
  logout: authActions.logout,
  dispatchUser: authActions.dispatch,
};

function mapStateToProps(state) {
  const isLoading = get(state, 'budgets.isLoading', false);
  const userInfo = select.userInfo(state);
  const availableBudgets = select.availableBudgets(state);// for syncing

  return {
    list: select.list(state),
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
    closeBudget(id) {
      const budgetQuery = Database.instance.budgets.findOne(id);
      budgetQuery.exec().then((budget) => {
        budget.state = 'closed';
        budget.save();
      });
    },
    openBudget(id) {
      const budgetQuery = Database.instance.budgets.findOne(id);
      budgetQuery.exec().then((budget) => {
        budget.state = 'opened';
        budget.save();
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets);
