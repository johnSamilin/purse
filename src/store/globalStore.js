import { Observable } from "../providers/Observable";

class Store {
  constructor() {
    this.modules = {};
    this.routes = {
      active: new Observable(''),
      next: new Observable([]),
      prev: new Observable([]),
    };
    this.users = new Observable([]);
    this.budgets = new Observable([]);
    this.transactions = new Observable([]);
    this.seentransactions = new Observable([]);
  }

  registerModule(module) {
    this.modules[module.namespace] = module.state;
  }
}

export const GlobalStore = new Store();
