// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import Budget from './Budget';
import Constructor from './Constructor';
import Budgets from './Budgets';
import Login from './Login';
import BudgetSettings from './BudgetSettings';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const routes = {
  path: '/',
  component: CoreLayout,
  getIndexRoute(partialNextState, callback) {
    Budgets.onEnter();
    callback(null, Budgets);
  },
  getChildRoutes(partialNextState, callback) {
    const childRoutes = [
      Budgets,
      Budget,
      Login,
      Constructor,
      BudgetSettings,
    ];
    
    const path = partialNextState.location.pathname;
    const activeRoute = childRoutes.find(route => route.pathMatcher.test(path));
    activeRoute.onEnter();
    callback(null, activeRoute);
  },
};

export default routes;
