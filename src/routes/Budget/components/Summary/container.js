// @ts-check
import { Component } from 'react';
import presenter from './presenter';
import { budgetsActions } from '../../../../modules/budgets/actions';
import { GlobalStore } from '../../../../store/globalStore';

export class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      myTotal: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      transactions = [],
      users = [],
    } = nextProps;
    const balances = budgetsActions.calculateBalances(transactions, users);
    const total = transactions
      .filter(transaction => !transaction.cancelled)
      .reduce((prev, current) => prev + current.amount, 0);

    this.setState({
      total,
      myTotal: balances.get(GlobalStore.modules.users.activeUser.value.id) || 0,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
    });
  }
}
