import { Observable } from "../../providers/Observable";
import { actions as authActions } from './actions';

const token = authActions.restoreToken();

export default {
  namespace: 'auth',
  state: {
    isLoggedIn: new Observable(!!token),
    token: new Observable(token),
  },
};
