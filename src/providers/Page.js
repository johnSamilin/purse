import { Component } from 'react';
import BEMHelper from 'react-bem-helper';
import { GlobalStore } from '../store/globalStore';

export class Page extends Component {
  constructor() {
    super();
    this.namespace = '';
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

  onActiveRouteChange(route) {
    this.setState({
      isActive: route === this.namespace,
    });
  }

  onNextRoutesChange(nextRoutes) {
    if (nextRoutes.includes(this.namespace)) {
      this.setState({
        isNext: true,
      });
    }
  }

  onPrevRoutesChange(prevRoutes) {
    if (prevRoutes.includes(this.namespace)) {
      this.setState({
        isPrev: true,
      });
    }
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
