import { Route } from '../../providers/Route';
import { path } from './const';
import { path as constructpath } from '../Constructor/const';
import { path as budgetpath } from '../Budget/const';
import { path as collaboratorspath } from '../Collaborators/const';
import { Budgets } from './containers';

class BudgetsRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [budgetpath, constructpath, collaboratorspath];
  }

  getContainer() {
    return Budgets;
  }
}

export default new BudgetsRoute();
