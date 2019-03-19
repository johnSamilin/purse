// @ts-check
import { withRouter } from 'react-router';
import { budgetStates } from '../../../const';
import { Database } from '../../../database';
import { notify, logger } from '../../../services/helpers';
import { Page } from '../../../providers/Page';
import { GlobalStore } from '../../../store/globalStore';
import presenter from '../components';
import { currencies, path } from '../const';
import { paths } from '../../Budgets/const';
import get from 'lodash/get';

@withRouter
export class Construct extends Page {
  constructor() {
    super();
    this.state = {
      values: {
        title: '',
        currency: currencies[0].value,
        invitedUsers: new Set(),
      },
      canCreate: false,
      users: [],
    };
    this.path = path;

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeInvitedUsers = this.onChangeInvitedUsers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    GlobalStore.routes.active.subscribe((route) => {
      if (route === this.path) {
        this.flush();
      }
    });
    GlobalStore.users.subscribe((users) => {
      this.setState({
        users: Array.from(users)
          .filter(([id, user]) => id !== get(GlobalStore.modules.users.activeUser.value, 'id', -1))
          .map(([id, user]) => user),
      });
    });
  }

  flush() {
    this.setState({
      values: {
        title: '',
        currency: currencies[0].value,
        invitedUsers: new Set(),
      },
      canCreate: false,
    });
  }

  onChangeTitle(title) {
    this.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        title,
      },
      canCreate: title.trim().length > 0,
    }));
  }

  onChangeCurrency(currency) {
    this.setState(state => ({
      ...state,
      values: {
        ...state.values,
        currency,
      },
    }));
  }

  onChangeInvitedUsers(userId) {
    const isInvited = this.state.values.invitedUsers.has(userId);
    const invitedUsers = this.state.values.invitedUsers;
    isInvited
      ? invitedUsers.delete(userId)
      : invitedUsers.add(userId)
    this.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        invitedUsers,
      },
    }));
  }

  async onSubmit(e) {
    e.preventDefault();
    if (!this.state.canCreate) {
      return false;
    }
    const users = [{
      id: GlobalStore.modules.users.activeUser.value.id,
      status: 'active',
      decision: 'pending',
    }];
    for (let userId of this.state.values.invitedUsers) {
      users.push({
        id: userId,
        status: 'invited',
        decision: 'pending',
      });
    }

    const id = Date.now().toString();
    try {
      const budget = await Database.instance.collections.budgets.insert({
        id,
        ownerId: GlobalStore.modules.users.activeUser.value.id,
        state: budgetStates.opened,
        title: this.state.values.title,
        currency: currencies[this.state.values.currency],
        sharelink: '',
        users,
        date: Date.now().toString(),
      });
      this.showBudget(budget);
    } catch (er) {
      logger.error(er);
      notify('Произошла ошибка');
    }
  }

  showBudget(budget) {
    GlobalStore.modules.budgets.activeBudget.value = budget;
    this.props.router.replace(paths.budget(budget.id));
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      getPageClasses: this.getPageClasses,
      onChangeTitle: this.onChangeTitle,
      onChangeCurrency: this.onChangeCurrency,
      onChangeInvitedUsers: this.onChangeInvitedUsers,
      onSubmit: this.onSubmit,
    });
  }
}
