import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import { get } from 'lodash';
import { database } from 'database';
import { notify } from 'services/helpers';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { currencies, paths } from '../const';

class Construct extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      currency: 'USD',
      canCreate: false,
    };
    this.doCreate = this.doCreate.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
  }

  doCreate() {
    const id = Date.now().toString();
    database.budgets.insert({
      id,
      ownerId: this.props.userId,
      state: "opened",
      title: this.state.title,
      currency: currencies[this.state.currency],
      sharelink: "",
      users: [],
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

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      doCreate: this.doCreate,
      setTitle: this.setTitle,
      setCurrency: this.setCurrency,
    });
  }
}

const mapDispatchToProps = {
  create: actions.create,
  showBudget: id => replace(paths.budget(id)),
}

const mapStateToProps = (state, ownProps) => {
  const userId = get(state, 'auth.data.id', -1);

  return {
    userId,
    isActive: state.modules.active === 'constructor',
    isNext: state.modules.next.includes('constructor'),
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
