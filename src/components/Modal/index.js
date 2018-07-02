import { Component } from 'react';
import presenter from './presenter';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: 0,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(isOpened) {
    this.setState({
      isOpened,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      toggle: this.toggle,
    });
  }
}
