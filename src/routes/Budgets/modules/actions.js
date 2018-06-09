import api from 'services/api';
import { budgetStates } from 'const';
import {
  apiPaths,
} from '../const';

function requestClosing(id) {
  return api.doPost(
    apiPaths.budget(id),
    {
      status: budgetStates.closing,
    }
  );
}

export const budgetsActions = {
  requestClosing,
};
