// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import BudgetRoute from './Budget';
import ConstructorRoute from './Constructor';
import BudgetsRoute from './Budgets';
import LoginRoute from './Login';
// import CollaboratorsRoute from './Collaborators';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const routes = {
  path: '/',
  component: CoreLayout,
  getIndexRoute(partialNextState, callback) {
    BudgetsRoute.onEnter();
    callback(null, BudgetsRoute);
  },
  getChildRoutes(partialNextState, callback) {
    const childRoutes = [
      BudgetsRoute,
      BudgetRoute,
      LoginRoute,
      ConstructorRoute,
      // CollaboratorsRoute,
    ];
    
    const path = partialNextState.location.pathname;
    const activeRoute = childRoutes.find(route => route.pathMatcher.test(path));
    activeRoute.onEnter();
    callback(null, activeRoute);
  },
};

export default routes;
