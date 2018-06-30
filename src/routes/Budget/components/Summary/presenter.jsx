import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import './style.scss';

function Summary(props) {
  const {
    total,
    myTotal,
    currency,
    showMyBalance,
  } = props;
  const classes = new BEMHelper('budget-summary');
  const totalSum = numeral(total);
  const mySum = numeral(myTotal);
  const format = '(0,[.]00 a)';

  return (
    <div {...classes()}>
      <div {...classes('sum', !showMyBalance ? 'wide' : '')}>
        <span {...classes('sum-note')}>Всего</span>
        <span {...classes('sum-text')}>{totalSum.format(format)}</span>
        <span {...classes('sum-currency')}>{currency}</span>
      </div>
      {showMyBalance &&
        <div {...classes('sum')}>
          <span {...classes('sum-note')}>Ваш баланс</span>
          <div {...classes('sum-text')}>
            <div {...classes({ element: 'sum-sign', modifiers: { negative: myTotal < 0, hidden: myTotal === 0 } })}>
              {myTotal > 0
                ? '+'
                : '-'
              }
            </div>
            <span>{mySum.format(format).replace(/[\(\)]*/g, '')}</span>
          </div>
          <span {...classes('sum-currency')}>{currency}</span>
        </div>
      }
    </div>
  );
}

export default Summary;
