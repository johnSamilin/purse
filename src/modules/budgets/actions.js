// @ts-check
import isEmpty from 'lodash/isEmpty';
import { budgetStates } from '../../const';
import { apiPaths } from '../../routes/Budgets/const';
import api from '../../services/api';
import { userStatuses } from '../../routes/Budget/const';

function requestClosing(id) {
  return api.doPost(
    apiPaths.budget(id),
    {
      status: budgetStates.closing,
    }
  );
}

function getBudgetFromServer(id) {
  return api.doGet(apiPaths.budget(id), {});
}

/**
 * 
 * @param {any} transaction
 * @param {array} participants
 * @returns {{participantId: number, balance: number }[]}
 */
function splitTransaction(transaction, participants) {
  let sum = transaction.amount / participants.length;
  sum = parseFloat(sum.toFixed(2));

  return participants.map((participant) => {
    return {
      participantId: participant.id,
      balance: participant.id.toString() === transaction.ownerId
        ? transaction.amount - sum
        : (-sum),
    };
  });
}

/**
 * 
 * @param {array} transactions
 * @param {any} users
 * @returns {Map<number, number>}
 */
function calculateBalances(transactions = [], users = []) {
  const balances = new Map(); // userId: balance
  const activeUserIds = new Set();
  const activeUsers = users.filter(user => user.status === userStatuses.active);
  activeUsers.forEach(user => activeUserIds.add(user.id));

  transactions
    .filter(transaction => !transaction.cancelled)
    .forEach((transaction) => {
      const activeCollaborators = transaction.collaborators
        .filter(clbr => activeUserIds.has(clbr.id));
      const participants = isEmpty(transaction.collaborators)
        ? activeUsers
        : [{ id: transaction.ownerId }, ...activeCollaborators]; // создатель + коллабораторы (те, которые в бюджете активны)
      const splitted = splitTransaction(transaction, participants);
      splitted.forEach((piece) => {
        if (!balances.has(piece.participantId)) {
          balances.set(piece.participantId, 0);
        }
        balances.set(piece.participantId, balances.get(piece.participantId) + piece.balance);
      });
    });

    console.log(balances)
  return balances;
}

export const budgetsActions = {
  requestClosing,
  getBudgetFromServer,
  calculateBalances,
};
