const forms = {
    login: 'login',
};

const tabs = {
    SMS: 'PHONE',
    EMAIL: 'EMAIL',
};
https://www.accountkit.com/v2.10/basic/dialog/sms_login/?app_id=1008388635966471&redirect=https%3A%2F%2Fpurse-front-herokuapp.com%2F&state=csrf_thing&fbAppEventsEnabled=true&debug=true&countryCode=%2B7&phoneNumber=9675925934
const countryCodes = [
    {
        value: '',
        label: 'Code',
    },
    {
        value: '+7',
        label: 'Russia (+7)',
    }
];

function getFormAction (apiVersion, type) {
    switch(type) {
        case tabs.SMS:
            return `https://www.accountkit.com/${apiVersion}/basic/dialog/sms_login/`;
        case tabs.EMAIL:
            return `https://www.accountkit.com/${apiVersion}/basic/dialog/email_login/`;            
    }
};

export {
    forms,
    tabs,
    countryCodes,
    getFormAction,
};
