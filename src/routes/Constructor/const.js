// TODO: use database to store currencies
const currencies = [
	{
		id: 0,
		key: 'USD',
		label: 'US Dollar',
	},
	{
		id: 1,
		key: 'EUR',
		label: 'Euro',
	},
	{
		id: 2,
		key: 'RUB',
		label: 'Russian rouble',
	},
	{
		id: 3,
		key: 'VND',
		label: 'Vietnam dong',
	},
];

const paths = {
	budget: id => `/budgets/${id}`,
};

export {
	currencies,
	paths,
};
