import { GlobalStore } from "../store/globalStore";

export class Route {
  constructor() {
    this.path = 'default';
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