const path = '/budgets';
const paths = {
  budget: id => `/budget/${id}`,
  construct: () => '/create',
};
const apiPaths = {
  budget: id => `/budgets/${id}`,
};

export {
  apiPaths,
  paths,
  path,
};
