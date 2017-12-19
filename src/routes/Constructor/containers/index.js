import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import { reduxForm, reset } from 'redux-form';
import { get } from 'lodash';
import { Database } from 'database';
import { notify } from 'services/helpers';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { currencies, paths, forms } from '../const';

@reduxForm({
  form: forms.constructor,
})
class Construct extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isActive === false && nextProps.isActive === true) {
      this.props.flush();
    }
  }

  onSubmit({
    title,
    currency,
    invitedUsers,
  }) {
    const users = [{
      id: this.props.userId,
      status: 'active',
    }];
    invitedUsers.forEach((user, id) => {
      if (user) {
        users.push({
          id: id.toString(),
          status: 'invited',
        });
      }
    });

    const id = Date.now().toString();
    Database.instance.budgets.insert({
      id,
      ownerId: this.props.userId.toString(),
      state: "opened",
      title: title,
      currency: currencies[currency],
      sharelink: "",
      users,
    }).then(this.props.create)
      .then(() => this.props.showBudget(id))
      .catch((er) => {
        console.error(er);
        notify('Произошла ошибка');
      });
  }

  render() {
    return presenter({
      ...this.props,
      onSubmit: this.onSubmit,
    });
  }
}

const mapDispatchToProps = {
  create: actions.create,
  showBudget: id => replace(paths.budget(id)),
  flush: () => reset(forms.constructor),
}

const mapStateToProps = (state, ownProps) => {
  const userId = get(state, 'auth.data.userInfo.id', '-1');
  const users = get(state, 'users.data', []) || [];
  const title = get(state, 'form.constructor.values.title', '') || '';
  const canCreate = title.trim().length;

  return {
    userId,
    isActive: state.modules.active === 'constructor',
    isNext: state.modules.next.includes('constructor'),
    users: users.filter(user => user.id !== userId),
    canCreate,
    initialValues: {
      title: '',
      currency: currencies[0].id,
      invitedUsers: [],
    },
  }
}

function mergeProps(state, dispatch, own) {
  return {
    ...state,
    ...dispatch,
    ...own,    
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Construct))
