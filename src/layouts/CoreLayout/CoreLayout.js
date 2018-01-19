import React, { Component } from 'react'
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';

import { Budget } from 'routes/Budget';
import { Budgets } from 'routes/Budgets';
import { Construct } from 'routes/Constructor';
import { Login } from 'routes/Login';
import { Collaborators } from 'routes/Collaborators';
import { notify } from 'services/helpers';
import get from 'lodash/get';

import './CoreLayout.scss';
import { Database } from '../../database/index';
import selectors from '../../routes/Budgets/modules/selectors';

const MobileDetect = require('mobile-detect');

export class CoreLayout extends Component {	
	constructor() {
	super();
		this.state = {
			isOffline: false,
		};
	}

	componentDidMount() {
		window.addEventListener('offline', () => this.setOfflineStatus(true));
		window.addEventListener('online', () => this.setOfflineStatus(false));
	}

	setOfflineStatus(isOffline) {
		notify(`${isOffline ? 'Я оффлайн' : 'Я снова онлайн'}`);
		if (isOffline) {
			Database.stopSync();
		} else {
			Database.startSync({ userId: this.props.userId, budgetIds: this.props.budgetIds });
		}
		this.setState({
			isOffline,
		});
	}

	render() {
		const { children, isLoggedIn } = this.props;
		const classes = new BEMHelper('core-layout');
		const md = new MobileDetect(window.navigator.userAgent);
		const isMobile = md.mobile()  && !md.tablet();
		const { isOffline } = this.state;
	
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
}

function mapStateToProps(state) {
	const { id } = selectors.userInfo(state);
	const budgetIds = selectors.availableBudgets(state);

	return {
		isLoggedIn: state.auth.data.loggedIn,
		userId: id,
		budgetIds,
	};
}

export default connect(mapStateToProps)(CoreLayout);
