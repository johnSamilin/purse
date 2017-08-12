import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';
import { database } from 'database';

class Budgets extends Component {
	componentWillMount() {
		// this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

const mapDispatchToProps = {
  load: actions.load,
}

const mapStateToProps = (state) => {

	return {
	  list: select.list(state),
	  activeId: select.active(state),
	  isActive: state.modules.active === 'budgets',
      isNext: state.modules.next.includes('budgets'),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Budgets)
