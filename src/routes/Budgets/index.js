import { Route } from '../../providers/Route';
import { namespace } from './const';
import { namespace as constructNamespace } from 'routes/Constructor/const';
import { Budgets } from './containers';

class BudgetsRoute extends Route {
  constructor() {
    super();
    this.path = namespace;
    this.nextRoutes = ['budget', constructNamespace];
  }

  getContainer() {
    return Budgets;
  }
}

export default new BudgetsRoute();
