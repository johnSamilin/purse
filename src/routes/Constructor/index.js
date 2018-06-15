import { Route } from '../../providers/Route';
import { namespace } from './const';
import { namespace as budgetsNamespace } from 'routes/Budgets/const';
import { Construct } from './containers';

class ConstructRoute extends Route {
  constructor() {
    super();
    this.path = namespace;
    this.nextRoutes = [];
    this.prevRoutes = [budgetsNamespace];
  }

  getContainer() {
    return Construct;
  }
}

export default new ConstructRoute();
