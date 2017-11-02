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
	if (getToken()) {
		store.dispatch(actions.refreshLogin());
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
