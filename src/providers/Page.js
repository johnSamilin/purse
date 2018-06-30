// @ts-check
import { Component } from 'react';
import BEMHelper from 'react-bem-helper';
import { GlobalStore } from '../store/globalStore';

export class Page extends Component {
  constructor(props) {
    super(props);
    this.path = '';
    this.state = {
      isActive: false,
      isNext: false,
      isPrev: false,
    };
    this.bemHelper = new BEMHelper('page');

    GlobalStore.routes.active.subscribe(route => this.onActiveRouteChange(route));
    GlobalStore.routes.next.subscribe(routes => this.onNextRoutesChange(routes));
    GlobalStore.routes.prev.subscribe(routes => this.onPrevRoutesChange(routes));

    this.getPageClasses = this.getPageClasses.bind(this);
  }

  componentWillMount() {
    this.setState({
      isActive: GlobalStore.routes.active.value === this.path,
      isNext: GlobalStore.routes.next.value.includes(this.path),
      isPrev: GlobalStore.routes.prev.value.includes(this.path),
    });
  }

  onActiveRouteChange(route) {
    this.setState({
      isActive: route === this.path,
    });
  }

  onNextRoutesChange(nextRoutes) {
    this.setState({
      isNext: nextRoutes.includes(this.path),
    });
  }

  onPrevRoutesChange(prevRoutes) {
    this.setState({
      isPrev: prevRoutes.includes(this.path),
    });
  }

  getPageClasses() {
    return this.bemHelper({
      modifiers: {
        next: this.state.isNext,
        active: this.state.isActive,
      },
    }).className;
  }

}
