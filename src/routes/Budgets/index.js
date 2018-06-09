import { Route } from '../../providers/Route';
import { namespace } from './const';
import { Budgets } from './containers';

class BudgetsRoute extends Route {
  constructor() {
    super();
    this.path = namespace;
    this.nextRoutes = ['budget', 'constructor'];
  }

  getContainer() {
    return Budgets;
  }
}

export default new BudgetsRoute();
