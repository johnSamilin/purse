const path = '/login';

const forms = {
  login: 'login',
};

const tabs = {
  SMS: 'PHONE',
  EMAIL: 'EMAIL',
};

const countryCodes = [
  {
    value: '',
    label: 'Code',
  },
  {
    value: '+7',
    label: 'Russia (+7)',
  },
];

const apiPaths = {
  getToken: () => '/auth/success',
};

function getFormAction(apiVersion, type) {
  switch (type) {
    case tabs.SMS:
      return `https://www.accountkit.com/${apiVersion}/basic/dialog/sms_login/`;
    case tabs.EMAIL:
      return `https://www.accountkit.com/${apiVersion}/basic/dialog/email_login/`;
  }
}

export {
  path,
  apiPaths,
  forms,
  tabs,
  countryCodes,
  getFormAction,
};
