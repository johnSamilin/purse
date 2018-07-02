// @ts-check
import pathToRegexp from 'path-to-regexp';
import { GlobalStore } from '../store/globalStore';

export class Route {
  set route(newPath) {
    this.path = newPath;
    this.pathMatcher = pathToRegexp(newPath, [], {});
  }

  constructor() {
    this.path = 'default';
    this.pathMatcher = null;
    this.nextRoutes = [];
    this.prevRoutes = [];
  }

  getContainer() {
    throw 'To be extended';
  }

  getComponent(nextState, cb) {
    cb(null, this.getContainer());
  }

  onEnter() {
    GlobalStore.routes.active.value = this.path;
    GlobalStore.routes.next.value = this.nextRoutes;
    GlobalStore.routes.prev.value = this.prevRoutes;
  }
}
