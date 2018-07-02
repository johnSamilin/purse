// @ts-check
import { Observable } from '../../providers/Observable';

export default {
  path: 'users',
  state: {
    activeUser: new Observable(),
  },
};
