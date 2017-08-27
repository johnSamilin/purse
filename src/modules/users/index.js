import { injectReducer } from 'store/reducers';
import reducer, { actions } from './actions';

function init(store) {
	injectReducer(store, { key: 'users', reducer } );
}

export default {
	init,
};
