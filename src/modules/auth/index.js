import { Observable } from "../../providers/Observable";

export default {
  namespace: 'auth',
  state: {
    isLoggedIn: new Observable(false),
    token: new Observable(''),
  },
};
