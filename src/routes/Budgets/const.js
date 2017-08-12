const paths = {
	budget: (id) => `/budgets/${id}`,
	construct: () => '/create',
};
const apiPaths = {
	budgets: () => 'budgets',
};

export {
	apiPaths,
	paths,
};
