import { Component } from 'react';
import presenter from './presenter';

export class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.setSelectedTab = this.setSelectedTab.bind(this);
  }

  setSelectedTab(index) {
    this.setState({
      activeTab: index,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      setSelectedTab: this.setSelectedTab,
    });
  }
}
