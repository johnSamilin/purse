// @ts-check
import { Observable } from '../../providers/Observable';

export default {
  path: 'budgets',
  state: {
    activeBudget: new Observable(),
  },
};
