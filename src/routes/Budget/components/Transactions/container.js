import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import get from 'lodash/get';
import Transactions from './presenter';

const mapDispatchToProps = {

};

const mapStateToProps = (state) => {
  const isLoading = get(state, 'budget.isLoading');

  return {
    isLoading,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Transactions));
