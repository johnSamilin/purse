const accountkitAppId = '1008388635966471';
const accountkitApiVersion = 'v1.10';
const csrf = 'csrf_thing';
const accountkitRedirect = !__DEV__
	? 'http://localhost:3000/'
	: 'https://purse-front-herokuapp.com/';

export {
	accountkitAppId,
	accountkitApiVersion,
	csrf,
	accountkitRedirect,
};
