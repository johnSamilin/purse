import React from 'react'
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';

import { Budget } from 'routes/Budget';
import { Budgets } from 'routes/Budgets';
import { Login } from 'routes/Login';

import './CoreLayout.scss';

export const CoreLayout = ({ children, isLoggedIn }) => {
	const classes = new BEMHelper('core-layout');
	const isMobile = true;
	const isOffline = false;

	return (
	  <div className='container'>
		<div {...classes({ element: 'viewport', modifiers: { mobile: isMobile, offline: isOffline } })}>
			{isLoggedIn === true
				? [
					<Budget />,
					<Budgets />
				]
				: <Login />
			}
		</div>
	  </div>
	)
}

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.data.loggedIn,
	};
}

export default connect(mapStateToProps)(CoreLayout);
