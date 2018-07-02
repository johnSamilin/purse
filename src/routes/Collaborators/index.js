// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetpath } from '../../routes/Budget/const';
import { path as budgetspath } from '../../routes/Budgets/const';
import { Collaborators } from './containers';

class CollaboratorsRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [];
    this.prevRoutes = [budgetpath, budgetspath];
  }

  getContainer() {
    return Collaborators;
  }
}

export default new CollaboratorsRoute();
