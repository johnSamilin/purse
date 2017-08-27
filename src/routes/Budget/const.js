const userStatuses = {
	none: 'Присоединиться',
	active: 'Все ок',
	pending: 'Ожидаем подтверждения',
	removed: 'Присоединиться еще раз',	
};

const apiPaths = {
	budget: id => `budgets/${id}`,
	transactions: budgetId => `transactions/${budgetId}`,
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
		title: 'Return',
		modifier: 'success',
		nextStatus: 'active',
	},
};

export {
	apiPaths,
	userStatuses,
	statusesMap,
};
