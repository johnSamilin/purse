// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetspath } from '../Budgets/const';
import { path as budgetSettingspath } from '../BudgetSettings/const';
import { Construct } from './containers';

class ConstructRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [budgetSettingspath];
    this.prevRoutes = [budgetspath];
  }

  getContainer() {
    return Construct;
  }
}

export default new ConstructRoute();
