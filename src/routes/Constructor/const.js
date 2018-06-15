const namespace = 'create';

// TODO: use database to store currencies
const currencies = [
  {
    value: 0,
    key: 'USD',
    label: 'US Dollar',
  },
  {
    value: 1,
    key: 'EUR',
    label: 'Euro',
  },
  {
    value: 2,
    key: 'RUB',
    label: 'Russian rouble',
  },
  {
    value: 3,
    key: 'VND',
    label: 'Vietnam dong',
  },
];

const paths = {
  budget: id => `/budgets/${id}`,
};

export {
  namespace,
  currencies,
  paths,
};
