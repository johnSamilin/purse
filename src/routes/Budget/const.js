// @ts-check
const path = '/budget/:id';

const userStatusMessages = {
  none: 'Присоединиться',
  active: 'Все ок',
  pending: 'Ожидаем подтверждения',
  removed: 'Присоединиться еще раз',
};

const apiPaths = {
  budget: id => `/budgets/${id}`,
  transactions: budgetId => `/transactions/${budgetId}`,
  membership: id => `/budgets/${id}/membership`,
};

const paths = {
  budget: id => `/budget/${id}`,
  settings: budgetId => `/budget/${budgetId}/settings`,
};

const userStatuses = {
  none: 'none',
  active: 'active',
  pending: 'pending',
  removed: 'removed',
  invited: 'invited',
};

const statusesMap = {
  active: {
    title: 'Убрать',
    modifier: 'removed',
    nextStatus: 'removed',
  },
  pending: {
    title: 'Добавить',
    modifier: 'success',
    nextStatus: 'active',
  },
  removed: {
    title: 'Пригласить',
    modifier: 'success',
    nextStatus: 'invited',
  },
  invited: {
    title: 'Отозвать',
    modifier: 'removed',
    nextStatus: 'removed',
  },
};

const forms = {
  transaction: 'transaction',
};

const decisions = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

export {
  path,
  apiPaths,
  paths,
  userStatusMessages,
  userStatuses,
  statusesMap,
  forms,
  decisions,
};
