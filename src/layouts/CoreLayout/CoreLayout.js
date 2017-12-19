import React from 'react'
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';

import { Budget } from 'routes/Budget';
import { Budgets } from 'routes/Budgets';
import { Construct } from 'routes/Constructor';
import { Login } from 'routes/Login';
import { Collaborators } from 'routes/Collaborators';

import './CoreLayout.scss';

const MobileDetect = require('mobile-detect');

export const CoreLayout = ({ children, isLoggedIn }) => {
	const classes = new BEMHelper('core-layout');
	const md = new MobileDetect(window.navigator.userAgent);
	const isMobile = md.mobile()  && !md.tablet();
	const isOffline = false;

	return (
	  <div className='container'>
			<div {...classes({ element: 'viewport', modifiers: { mobile: isMobile, offline: isOffline } })}>
				{isLoggedIn === true
					? [
						<Collaborators />,
						<Budget />,
						<Construct />,
						<Budgets />
					]
					: <Login />
				}
			</div>
	  </div>
	)
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.data.loggedIn,
	};
}

export default connect(mapStateToProps)(CoreLayout);
