import { Route } from '../../providers/Route';
import { path } from './const';
import { Login } from './containers';

class LoginRoute extends Route {
  constructor() {
    super();
    this.route = path;
  }

  getContainer() {
    return Login;
  }
}

export default new LoginRoute();
