// @ts-check
import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';
import './Splash.scss';
import { Button } from '../components';

const classes = new BEMHelper('splash');

class Splash extends Component {
  render() {
    return (
      <div {...classes()}>
        <div {...classes('message')}>
          <div {...classes('heading')}>
            <span>Минуточку внимания</span>
          </div>
          <p>
            Система выделила очень мало памяти ({Math.ceil(this.props.grantedQuota / 1024)} KB), поэтому offline-режим работать не будет.
          </p>
          <div {...classes('heading')}>
            <span>Что делать?</span>
          </div>
          <ol>
            <li>Освободить немного места на устройстве</li>
            <li>Использовать другой браузер, например, Yandex.Browser</li>
            <li>Или продолжить работу с учетом этого</li>
          </ol>
        </div>
        <div {...classes('buttons')}>
          <Button onClick={this.props.onContinue} mods={['success']}>Продолжить</Button>
        </div>
      </div>
    );
  }
}

export default Splash;
