// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetspath } from 'routes/Budgets/const';
import { Construct } from './containers';

class ConstructRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [];
    this.prevRoutes = [budgetspath];
  }

  getContainer() {
    return Construct;
  }
}

export default new ConstructRoute();
