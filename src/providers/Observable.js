import isEqual from 'lodash/isEqual';

export class Observable {
  constructor(value) {
    this.target = {
      value,
    };
    this.lastSubscriberId = 1;
    this.subscribers = new Map();
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.onChange = this.onChange.bind(this);

    return new Proxy(
      this.target,
      {
        get: (obj, prop) => {
          if (prop === 'value') {
            return this.target.value;
          }
          return this[prop];
        },
        set: this.onChange,
        subscribe: this.subscribe,
        unsubscribe: this.unsubscribe,
      }
    );
  }

  async onChange(obj, prop, value) {
    if (prop === 'value' && !isEqual(this.target.value, value)) {
      this.target.value = value;
      const iterator = this.subscribers.entries();
      let { done, value: subscriber } = iterator.next();
      while (!done && subscriber) {
        await subscriber[1](value);
        const next = iterator.next();
        done = next.done;
        subscriber = next.value;
      }
    }

    return true;
  }

  subscribe(clbk) {
    this.lastSubscriberId += 1;
    this.subscribers.set(this.lastSubscriberId, clbk);

    return this.lastSubscriberId;
  }

  unsubscribe(id) {
    this.subscribers.delete(id);
  }
}
