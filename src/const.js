const accountkitAppId = '1008388635966471';
const accountkitApiVersion = 'v1.10';
const csrf = 'csrf_thing';
const apiPaths = {
  backend: __DEV__
    ? 'http://localhost/purse-back/index.php'
    : 'https://purse-back.herokuapp.com',
  frontend: __DEV__
    ? 'http://localhost:3000/'
    : 'https://purseapp.herokuapp.com',
};
const accountkitRedirect = apiPaths.frontend;

const budgetStates = {
  opened: 'opened',
  closed: 'closed',
  closing: 'closing',
};

export {
  accountkitAppId,
  accountkitApiVersion,
  csrf,
  accountkitRedirect,
  apiPaths,
  budgetStates,
};
