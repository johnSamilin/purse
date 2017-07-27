import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import './style.scss';

export const Login = (props) => {
  const {
    smsLogin,
    emailLogin,
    isActive,
  } = props;
  const classes = new BEMHelper('login');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: isActive } }).className;

  return (
    <div
      {...classes({ extra: pageClasses })}
    >
      <input value="+1" id="country_code" />
      <input placeholder="phone number" id="phone_number"/>
      <button onClick={smsLogin}>Login via SMS</button>
      <div>OR</div>
      <input placeholder="email" id="email"/>
      <button onClick={emailLogin}>Login via Email</button>
    </div>
  )
}

export default Login;
