function showNotification(text) {
  try {
    const notification = new Notification(text);
    return notification;
  } catch (er) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Росплата', {
        body: text,
        /*icon: '../images/touch/chrome-touch-icon-192x192.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'vibration-sample'*/
      });
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
    showNotification(text);
  }

  // В противном случает мы запрашиваем разрешение
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      // Если пользователь разрешил, то создаем уведомление
      if (permission === 'granted') {
        showNotification(text);
      }
    });
  }

  return;

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
  log: (message) => {
    if (__DEV__) {
      console.log(message);
    }
  },
};

export function mapTransactionsToBudgets(transactions) {
  const map = {};
  if (transactions !== null) {
    transactions.forEach((transaction) => {
      if (!map[transaction.budgetId]) {
        map[transaction.budgetId] = {
          count: 0,
          sum: 0,
        };
      }
      map[transaction.budgetId].count += 1;
      map[transaction.budgetId].sum += transaction.cancelled ? 0 : transaction.amount;
    });
  }

  return map;
}

export function mapSeenTransactionsToBudgets(transactions) {
  const map = {};
  if (transactions !== null) {
    transactions.forEach((transaction) => {
      map[transaction.budgetId] = transaction.transactions;
    });
  }

  return map;
}
