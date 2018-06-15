import { budgetStates } from 'const';
import { Database } from 'database';
import React from 'react';
import { withRouter } from 'react-router';
import { notify } from 'services/helpers';
import { Page } from '../../../providers/Page';
import { GlobalStore } from '../../../store/globalStore';
import presenter from '../components';
import { currencies, namespace } from '../const';

@withRouter
class Construct extends Page {
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
    this.namespace = namespace;

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeInvitedUsers = this.onChangeInvitedUsers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    GlobalStore.routes.active.subscribe(route => {
      if (route === this.namespace) {
        this.flush();
      }
    });
    GlobalStore.users.subscribe(users => {
      this.setState({
        users: users.filter(user => user.id !== GlobalStore.modules.users.activeUser.value.id),
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
    this.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        currency,
      },
    }));
  }

  onChangeInvitedUsers(userId) {
    const isInvited = !this.state.values.invitedUsers.has(userId);
    const invitedUsers = this.state.values.invitedUsers;
    isInvited
      ? invitedUsers.add(userId)
      : invitedUsers.delete(userId)
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
    const iterator = this.state.values.invitedUsers.entries();
    let { done, value: userId } = iterator.next();
    while (!done && userId) {
      users.push({
        id: userId,
        status: 'invited',
        decision: 'pending',
      });      
      const next = iterator.next();
      done = next.done;
      userId = next.value;
    }

    const id = Date.now().toString();
    try {
      const budget = await Database.instance.budgets.insert({
        id,
        ownerId: GlobalStore.modules.users.activeUser.value.id,
        state: budgetStates.opened,
        title: title,
        currency: currencies[currency],
        sharelink: "",
        users,
        date: Date.now().toString(),
      });
      await this.create(budget);
      this.showBudget(id);
      } catch(er) {
        console.error(er);
        notify('Произошла ошибка');
      }
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

// const mapDispatchToProps = {
//   create: actions.create,
//   showBudget: id => replace(paths.budget(id)),
//   flush: () => reset(forms.constructor),
// }

// const mapStateToProps = (state, ownProps) => {
//   const userId = get(state, 'auth.data.userInfo.id', '-1');
//   const users = get(state, 'users.data', []) || [];
//   const title = get(state, 'form.constructor.values.title', '') || '';
//   const canCreate = title.trim().length;

//   return {
//     userId,
//     isActive: state.modules.active === 'constructor',
//     isNext: state.modules.next.includes('constructor'),
//     users: users.filter(user => user.id !== userId),
//     canCreate,
//     initialValues: {
//       title: '',
//       currency: currencies[0].value,
//       invitedUsers: [],
//     },
//   }
// }

// function mergeProps(state, dispatch, own) {
//   return {
//     ...state,
//     ...dispatch,
//     ...own,    
//   };
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Construct))

export {
  Construct,
};