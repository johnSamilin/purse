// @ts-check
import { Observable } from '../../providers/Observable';
import { actions as authActions } from './actions';

const token = authActions.restoreToken();

export default {
  path: 'auth',
  state: {
    isLoggedIn: new Observable(!!token),
    token: new Observable(token),
  },
};
