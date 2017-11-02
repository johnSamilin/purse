import { injectReducer } from 'store/reducers';
import reducer, { actions } from './actions';

const tokenName = 'X-Auth-Token';

function getToken() {
	return localStorage.getItem(tokenName);
}

function setToken(token) {
	return localStorage.setItem(tokenName, token);
}

function init(store) {
	injectReducer(store, { key: 'auth', reducer } );
	const token = getToken();
	if (token) {
		store.dispatch(actions.login(token));
	} else {
		store.dispatch(actions.logout());
	}
}

export default {
	init,
	getToken,
	setToken,
};
export {
	tokenName,
};
