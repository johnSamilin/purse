const userStatusMessages = {
  none: 'Присоединиться',
  active: 'Все ок',
  pending: 'Ожидаем подтверждения',
  removed: 'Присоединиться еще раз',
};

const apiPaths = {
  budget: id => `/budgets/${id}`,
  transactions: budgetId => `/transactions/${budgetId}`,
};

const paths = {
  collaborators: budgetId => `/budgets/${budgetId}/collaborators`,
};

const userStatuses = {
  none: 'none',
  active: 'active',
  pending: 'pending',
  removed: 'removed',
};

const statusesMap = {
  active: {
    title: 'Disable',
    modifier: 'removed',
    nextStatus: 'removed',
  },
  pending: {
    title: 'Approve',
    modifier: 'success',
    nextStatus: 'active',
  },
  removed: {
    title: 'Invite',
    modifier: 'success',
    nextStatus: 'invited',
  },
  invited: {
    title: 'Revoke',
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
  apiPaths,
  paths,
  userStatusMessages,
  userStatuses,
  statusesMap,
  forms,
  decisions,
};
