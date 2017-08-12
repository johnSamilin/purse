import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import Header from './presenter';

const mapDispatchToProps = {
  goTo: url => push(url),
}

const mapStateToProps = (state) => {

  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
