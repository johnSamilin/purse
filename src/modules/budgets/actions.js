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
function splitTransaction(transaction, participants, budgetOwnerId) {
  let sum = transaction.amount / participants.length;
  sum = parseFloat(sum.toFixed(2));
  const result = [];
  if (transaction.isPaidByOwner) {
    result.push({
      id: budgetOwnerId,
      balance: transaction.amount - sum,
    });
  }

  return participants.map((participant) => {
    const isOwner = participant.id.toString() === transaction.ownerId;
    const isPaidByOwner = transaction.isPaidByOwner;
    let balance = sum;
    if (isPaidByOwner) {
      balance = (-balance);
    } else {
      if (isOwner) {
        balance = transaction.amount - sum;
      } else {
        balance = (-balance);
      }
    }

    return {
      participantId: participant.id,
      balance,
    };
  });
}

/**
 * 
 * @param {array} transactions
 * @param {any} users
 * @returns {Map<number, number>}
 */
function calculateBalances(transactions = [], users = [], budgetOwnerId = -1) {
  const balances = new Map(); // userId: balance
  const activeUserIds = new Set();
  const activeUsers = users.filter(user => user.status === userStatuses.active);
  activeUsers.forEach(user => activeUserIds.add(user.id));

  transactions
    .filter(transaction => !transaction.cancelled)
    .forEach((transaction) => {
      const activeCollaborators = transaction.collaborators.filter(clbr => activeUserIds.has(clbr.id));
      const participants = isEmpty(transaction.collaborators)
        ? activeUsers
        : [{ id: transaction.ownerId }, ...activeCollaborators]; // создатель + коллабораторы (те, которые в бюджете активны)
      const splitted = splitTransaction(transaction, participants, budgetOwnerId);
      splitted.forEach((piece) => {
        if (!balances.has(piece.participantId)) {
          balances.set(piece.participantId, 0);
        }
        balances.set(piece.participantId, balances.get(piece.participantId) + piece.balance);
      });
    });

  return balances;
}

export const budgetsActions = {
  requestClosing,
  getBudgetFromServer,
  calculateBalances,
};
