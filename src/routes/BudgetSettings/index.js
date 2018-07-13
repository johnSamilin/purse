// @ts-check
import { Route } from '../../providers/Route';
import { path } from './const';
import { path as budgetpath } from '../../routes/Budget/const';
import { path as budgetspath } from '../../routes/Budgets/const';
import { Settings } from './containers';

class SettingsRoute extends Route {
  constructor() {
    super();
    this.route = path;
    this.nextRoutes = [];
    this.prevRoutes = [budgetpath, budgetspath];
  }

  getContainer() {
    return Settings;
  }
}

export default new SettingsRoute();
