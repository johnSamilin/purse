// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetspath } from '../../routes/Budgets/const';
import { path as budgetSettingspath } from '../../routes/BudgetSettings/const';
import { Budget } from './containers';

class BudgetRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.exact = false;
    this.nextRoutes = [budgetSettingspath];
    this.prevRoutes = [budgetspath];
  }

  getContainer() {
    return Budget;
  }
}

export default new BudgetRoute();
