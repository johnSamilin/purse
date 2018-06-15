import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  Button,
  Select,
  Input,
  LoadingPanel,
} from 'components';
import { Field } from 'redux-form';
import { countryCodes } from '../const';
import './style.scss';
import { Tabs } from '../../../components/Tabs/index';

function CountryCode({ input, className }) {
  return (<Select
    value={input.value}
    onChange={input.onChange}
    options={countryCodes}
    className={className}
  />);
}

function Phone({ input, className }) {
  return (<Input
    className={className}
    value={input.value}
    onChange={input.onChange}
    placeholder={'1234567'}
    type={'tel'}
  />);
}

function Email({ input, className }) {
  return (<Input
    className={className}
    value={input.value}
    onChange={input.onChange}
    placeholder={'boss@acme.com'}
  />);
}

export const Login = (props) => {
  const {
    isActive,
    handleSubmit,
    onSubmit,
    isLoading,
    onTabChange,
  } = props;
  const classes = new BEMHelper('login');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: isActive } }).className;
  const sections = [
    {
      title: 'По СМС',
      content: (
        <div {...classes('input')}>
          <Field
            {...classes('country-code')}
            component={CountryCode}
            name={'countryCode'}
          />
          <Field
            {...classes('phone')}
            component={Phone}
            name={'phoneNumber'}
          />
        </div>
      ),
    },
    {
      title: 'По Email',
      content: (
        <div {...classes('input')}>
          <Field
            {...classes('email')}
            component={Email}
            name={'emailAddress'}
          />
        </div>
      ),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      {...classes({ extra: pageClasses })}
    >
      <div {...classes('heading')}>
        <div {...classes('title')}>
          Росплата
        </div>
        <div {...classes('text')}>
          Привет! Прежде, чем продолжить или начать пользоваться сервисом, нужно войти с помощью Email или SMS. Вы просто получите код, для этого не надо даже иметь аккаунт на Facebook.
        </div>
      </div>
      <Tabs sections={sections} onChange={onTabChange} />
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