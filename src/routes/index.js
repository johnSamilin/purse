// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
// import BudgetRoute from './Budget';
// import ConstructorRoute from './Constructor';
// import BudgetsRoute from './Budgets';
import LoginRoute from './Login';
// import CollaboratorsRoute from './Collaborators';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = {
  path: '/',
  component: CoreLayout,
  indexRoute: LoginRoute,
  childRoutes: [
    // BudgetsRoute,
    // BudgetRoute,
    LoginRoute,
    // ConstructorRoute,
    // CollaboratorsRoute,
  ],
};

export default createRoutes;
