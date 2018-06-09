import { Route } from '../../providers/Route';
import { namespace } from './const';
import { Login } from './containers';

class LoginRoute extends Route {
  constructor() {
    super();
    this.path = namespace;
  }

  getContainer() {
    return Login;
  }
}

export default new LoginRoute();
