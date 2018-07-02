import { withRouter } from 'react-router';
import { Component } from 'react';
import presenter from './presenter';

@withRouter
class Header extends Component {
  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
  }
  

  goTo(path) {
    if (!path) {
      this.props.router.goBack();
    } else {
      this.props.router.replace(path);
    }
  }

  render() {
    return presenter({
      ...this.props,
      goTo: this.goTo,
    });
  }
}

export default Header;
