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
	// store.dispatch(getToken() ? actions.login() : actions.logout());
	const currentUser = JSON.parse(localStorage.getItem('userinfo')) || {
		id: '0',
		name: 'user #0',
	};
	store.dispatch(actions.login(currentUser));
}

export default {
	init,
	getToken,
	setToken,
};
export {
	tokenName,
};
