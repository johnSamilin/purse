// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetspath } from '../Budgets/const';
import { path as collaboratorspath } from '../Collaborators/const';
import { Construct } from './containers';

class ConstructRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [collaboratorspath];
    this.prevRoutes = [budgetspath];
  }

  getContainer() {
    return Construct;
  }
}

export default new ConstructRoute();
