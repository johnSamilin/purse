export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' }).then((reg) => {
      // регистрация сработала
      console.log(`Registration succeeded. Scope is ${reg.scope}`);
    }).catch((error) => {
      // регистрация прошла неудачно
      console.log(`Registration failed with ${error}`);
    });
  }
}

export function notify(text) {
  // Проверка поддерживаемости браузером уведомлений
  if (!('Notification' in window)) {
    return false;
  }

  // Проверка разрешения на отправку уведомлений
  else if (Notification.permission === 'granted') {
    // Если разрешено то создаем уведомлений
    const notification = new Notification(text);
    return true;
  }

  // В противном случает мы запрашиваем разрешение
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      // Если пользователь разрешил, то создаем уведомление
      if (permission === 'granted') {
        const notification = new Notification(text);
        return true;
      }
    });
  }

  // В конечном счете если пользователь отказался от получения
  // уведомлений, то стоит уважать его выбор и не беспокоить его
  // по этому поводу .
}

export const logger = {
  error: (message) => {
    if (__DEV__) {
      console.error(message);
    }
  },
};

export function mapTransactionsToBudgets(transactions) {
  const map = {};
  if (transactions !== null) {
    transactions.forEach((transaction) => {
      if (!map[transaction.budgetId]) {
        map[transaction.budgetId] = 0;
      }
      map[transaction.budgetId] += 1;
    });
  }

  return map;
}
