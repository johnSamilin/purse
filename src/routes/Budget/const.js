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

export {
	apiPaths,
	userStatuses,
};
