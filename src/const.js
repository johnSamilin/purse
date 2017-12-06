const accountkitAppId = '1008388635966471';
const accountkitApiVersion = 'v1.10';
const csrf = 'csrf_thing';
const apiPaths = {
	backend: 'https://purse-back.herokuapp.com',
	frontend: 'https://purseapp.herokuapp.com',
};
const accountkitRedirect = !__DEV__
	? 'http://localhost:3000/'
	: apiPaths.frontend;

export {
	accountkitAppId,
	accountkitApiVersion,
	csrf,
	accountkitRedirect,
	apiPaths,
};
