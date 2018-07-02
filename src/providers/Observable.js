// @ts-check
import isEqual from 'lodash/isEqual';
import { isRxDocument, isRxCollection } from 'rxdb';

export class Observable {
  constructor(value) {
  /**
   * @type {any}
   */
    this.value = null;

    this.target = {
      value,
    };
    this.lastSubscriberId = 1;
    this.subscribers = new Map();
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.onChange = this.onChange.bind(this);

    // @ts-ignore
    return this.getProxy();
  }

  getProxy() {
    const target = new Proxy(
      this.target,
      {
        get: (obj, prop) => {
          if (prop === 'value') {
            return this.target.value;
          }
          return this[prop];
        },
        set: (obj, prop, val) => {
          this.onChange(obj, prop, val);
          return true;
        },
      }
    );
    target.subscribe = this.subscribe;
    target.unsubscribe = this.unsubscribe;

    return target;
  }

  // onChange(obj, prop, value) {
  //   if (prop === 'value' && !isEqual(this.target.value, value)) {
  //     this.notify(value);
  //   }
  // }
  onChange(obj, prop, value) {
    if (prop === 'value') {
      if (this.isRx(value)) {
        this.target.value = value;

        // TODO: fix possible memory leak
        this.target.value.$.subscribe(newValue => this.notify(newValue));
      } else {
        if (!isEqual(this.target.value, value)) {
          this.target.value = value;
          this.notify(value);
        }
      }
    }
  }

  isRx(target) {
    return isRxDocument(target) || isRxCollection(target);
  }

  async notify(value) {
    const iterator = this.subscribers.entries();
    let { done, value: subscriber } = iterator.next();
    while (!done && subscriber) {
      await subscriber[1](value);
      const next = iterator.next();
      done = next.done;
      subscriber = next.value;
    }
  }

  subscribe(clbk) {
    this.lastSubscriberId += 1;
    this.subscribers.set(this.lastSubscriberId, clbk);

    return this.lastSubscriberId;
  }

  unsubscribe(id) {
    this.subscribers.delete(id);
  }

  once(clbk) {
    const subscribeId = this.subscribe((data) => {
      clbk(data);
      this.unsubscribe(subscribeId);
    });
  }
}
