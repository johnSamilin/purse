import { GlobalStore } from "../../../store/globalStore";
import { userStatuses } from '../../Budget/const';
import { budgetStates } from 'const';
import get from 'lodash/get';

export function getBudgets() {
  let budgetsList = GlobalStore.budgets.value;
  const transactionsList = GlobalStore.transactions.value;
  const seentransactionsList = GlobalStore.seentransactions.value;
  const userId = GlobalStore.modules.users.activeUser.value.id;

  budgetsList = budgetsList.map((budget) => {
    const activeUsers = budget.users.filter(user => user.status === userStatuses.active).length;
    const seenTransactionsCount = get(seentransactionsList, `${budget.id}`, 0);
    const transactions = get(transactionsList, budget.id, { count: 0, sum: 0 });

    return {
      ...budget,
      canManage: budget.ownerId === userId,
      transactionsCount: transactions.count,
      sum: transactions.sum,
      newTransactionsCount: transactions.count - seenTransactionsCount,
      activeUsers,
    };
  });

  const activeList = budgetsList.filter(budget => budget.state !== budgetStates.closing);
  const pendingAttentionList = budgetsList.filter(budget => budget.state === budgetStates.closing);
  
  return {
    activeList,
    pendingAttentionList,
  };
}

