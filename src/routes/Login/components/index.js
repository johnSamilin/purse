import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  Button,
  Select,
  Input,
  LoadingPanel,
} from 'components';
import { countryCodes } from '../const';
import './style.scss';
import { Tabs } from '../../../components/Tabs/index';

export const Login = (props) => {
  const {
    getPageClasses,
    onSubmit,
    isLoading,
    onTabChange,
    onInputChange,
  } = props;
  const classes = new BEMHelper('login');
  const sections = [
    {
      title: 'По СМС',
      content: (
        <div {...classes('input')}>
          <Select
            {...classes('country-code')}
            onChange={e => onInputChange('countryCode', e)}
            options={countryCodes}
          />
          <Input
            {...classes('phone')}
            onChange={e => onInputChange('phoneNumber', e)}
            placeholder={'1234567'}
            type={'tel'}
          />
        </div>
      ),
    },
    {
      title: 'По Email',
      content: (
        <div {...classes('input')}>
          <Input
            {...classes('email')}
            onChange={e => onInputChange('emailAddress', e)}
            placeholder={'boss@acme.com'}
          />
        </div>
      ),
    },
  ];

  return (
    <form
      onSubmit={onSubmit}
      {...classes({ extra: getPageClasses() })}
    >
      <div {...classes('heading')}>
        <div {...classes('title')}>
          Росплата
        </div>
        <div {...classes('text')}>
          Войдите используя номер телефона.<br/>
          Мы используем AccountKit от Facebook, при этом абсолютно ничего не делаем с вашим аккаунтом. Вы вообще можете его не иметь
        </div>
      </div>
      <Tabs sections={sections} onChange={onTabChange} />
      <div {...classes('version')}>Версия {__VERSION__}</div>
      <div {...classes('buttons')}>
        <Button
          {...classes('button')}
          mods={['success']}
          type={'submit'}
        >
          Войти
        </Button>
      </div>
      <LoadingPanel isActive={isLoading} />
    </form>
  );
};

export default Login;
