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
	console.warn('TODO: remove'); setToken('ya29.GooB9AOQPW5zemgHdJm1Vv9hJDrUs_FwQeHMkv9RV7fr3X8kv3xfRJQAVfRx3LLzAz7u4ZTqWrmGcZGUQxwhmYO28FuAlsU6zaAPrShqzq3XvJqT74VkIDjIGwSz0NOv7edv0XDteoyVVTzuT1u03Yqc7qdj8eF3tLTRQ4W1hoTYtJ7eV8iBWL5epxW6');
	store.dispatch(getToken() ? actions.login() : actions.logout());
}

actions.login({
	id: '0',
});

export default {
	init,
	getToken,
	setToken,
};
export {
	tokenName,
};
