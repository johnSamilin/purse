import React from 'react';
import BEMHelper from 'react-bem-helper';

const MobileDetect = require('mobile-detect');

import './Modal.scss';

function Modal(props) {
  const classes = new BEMHelper('modal-window');
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = md.mobile() && !md.tablet();

  const {
    isOpened,
    toggle,
    children,
    title,
    actions,
  } = props;

  return (
    <div {...classes({ modifiers: { isMobile } })}>
      <div {...classes('window')}>
        <div {...classes('title')}>{title}</div>
        <div {...classes('content')}>{children}</div>
        {actions &&
          <div {...classes('actions')}>
            {actions.map(action => action)}
          </div>
        }
      </div>
    </div>
  );
}

export default Modal;
