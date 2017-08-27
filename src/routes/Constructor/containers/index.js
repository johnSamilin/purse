import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import { reduxForm, reset } from 'redux-form';
import { get } from 'lodash';
import { database } from 'database';
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
    this.state = {
      title: '',
      currency: 0,
      canCreate: false,
    };
    this.gainFocus = false;
    this.doCreate = this.doCreate.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.flush = this.flush.bind(this);
    this.toggleUser = this.toggleUser.bind(this);
    this.invitedUsers = [];
  }

  componentWillReceiveProps(nextProps) {
    this.gainFocus = this.props.isActive === false && nextProps.isActive === true;
    if (this.gainFocus) {
      this.flush();
    }
  }

  flush() {
    this.props.flush();
    this.setState({
      title: '',
      currency: 0,
      canCreate: false,
    });
    this.invitedUsers = [];
  }

  doCreate() {
    const id = Date.now().toString();
    let users =  [{
      id: this.props.userId,
      status: 'active',
    }];
    users = users.concat(this.invitedUsers
      .filter(user => user != null)
      .map(user => ({
        id: user.id,
        status: 'invited',
      }))
    );

    database.budgets.insert({
      id,
      ownerId: this.props.userId.toString(),
      state: "opened",
      title: this.state.title,
      currency: currencies[this.state.currency],
      sharelink: "",
      users,
    }).then(this.props.create)
      .then(() => this.props.showBudget(id))
      .catch((er) => {
        console.error(er);
        notify('Произошла ошибка');
      });
  }

  setTitle(title) {
    this.setState({
      title: title.trim(),
      canCreate: title.trim().length !== 0,
    });
  }

  setCurrency(currency) {
    this.setState({
      currency,
    });
  }

  toggleUser(user, invite = false) {
    const isUserInvited = this.invitedUsers[user.id] !== undefined;
    if (!invite && !isUserInvited) {
      return false;
    }
    if (!invite) {
      delete this.invitedUsers[user.id];
    } else {
      this.invitedUsers[user.id] = user;
    }
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      doCreate: this.doCreate,
      setTitle: this.setTitle,
      setCurrency: this.setCurrency,
      toggleUser: this.toggleUser,
      invitedUsers: this.invitedUsers,
      gainFocus: this.gainFocus,
    });
  }
}

const mapDispatchToProps = {
  create: actions.create,
  showBudget: id => replace(paths.budget(id)),
  flush: () => reset(forms.constructor),
}

const mapStateToProps = (state, ownProps) => {
  const userId = get(state, 'auth.data.id', '-1').toString();
  const users = get(state, 'users.data', []) || [];

  return {
    userId,
    isActive: state.modules.active === 'constructor',
    isNext: state.modules.next.includes('constructor'),
    users: users.filter(user => user.id !== userId),
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
