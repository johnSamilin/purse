// @ts-check
import { Component } from 'react';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';

export default class BudgetInfo extends Component {
  constructor(props) {
    super(props);
    this.selectBudget = this.selectBudget.bind(this);
  }

  selectBudget(budget) {
    GlobalStore.modules.budgets.activeBudget.value = budget;
  }

  render() {
    return presenter({
      ...this.props,
      selectBudget: this.selectBudget,
    });
  }
}
