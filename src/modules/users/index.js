import { Observable } from "../../providers/Observable";

export default {
  namespace: 'users',
  state: {
    activeUser: new Observable(),
  },
};
