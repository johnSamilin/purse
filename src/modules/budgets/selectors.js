// @ts-check
import get from 'lodash/get';
import { budgetStates } from '../../const';
import { userStatuses } from '../../routes/Budget/const';
import { GlobalStore } from '../../store/globalStore';

export function getBudgets() {
  let budgetsList = GlobalStore.budgets.value;
  const transactionsList = GlobalStore.transactions.value;
  const seentransactionsList = GlobalStore.seentransactions.value;
  const userId = GlobalStore.modules.users.activeUser.value.id;

  budgetsList = budgetsList.map((budget) => {
    const activeUsers = budget.users.filter(user => user.status === userStatuses.active).length;
    const seenTransactionsCount = get(seentransactionsList, `${budget.id}`, 0);
    const transactions = get(transactionsList, budget.id, { count: 0, sum: 0 });
    budget.canManage = budget.ownerId === userId;
    budget.transactionsCount = transactions.count;
    budget.sum = transactions.sum;
    budget.newTransactionsCount = transactions.count - seenTransactionsCount;
    budget.activeUsers = activeUsers;

    return budget;
  });

  const activeList = budgetsList.filter(budget => budget.state !== budgetStates.closing);
  const pendingAttentionList = budgetsList.filter(budget => budget.state === budgetStates.closing);

  return {
    activeList,
    pendingAttentionList,
  };
}

