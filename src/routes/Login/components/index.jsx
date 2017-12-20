import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import {
  Button,
  Select,
  Input,
  LoadingPanel,
} from 'components';
import { Field } from 'redux-form';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { tabs, countryCodes } from '../const';
import './style.scss';

function CountryCode({ input, className }) {
  return <Select
    value={input.value}
    onChange={input.onChange}
    options={countryCodes}
    className={className}
  />;
}

function Phone({ input, className }) {
  return <Input
    className={className}
    value={input.value}
    onChange={input.onChange}
    placeholder={'1234567'}
    type={'tel'}
  />;
}

function Email({ input, className }) {
  return <Input
    className={className}
    value={input.value}
    onChange={input.onChange}
    placeholder={'boss@acme.com'}
  />;
}

export const Login = (props) => {
  const {
    isActive,
    handleSubmit,
    onSubmit,
    onTabChange,
    activeTab,
    isLoading,
  } = props;
  const classes = new BEMHelper('login');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: isActive } }).className;

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
      <Tabs
        {...classes('tabs')}
        onSelect={onTabChange}
      >
        <TabList {...classes('tabs-list')}>
          <Tab {...classes({
            element: 'tab',
            modifiers: {
              selected: activeTab === tabs.SMS,
            },
          })}>SMS</Tab>
          <Tab {...classes({
            element: 'tab',
            modifiers: {
              selected: activeTab === tabs.EMAIL,
            },
          })}>Email</Tab>
        </TabList>

        <TabPanel {...classes({
          element: 'tab-content',
          modifiers: {
            selected: activeTab === tabs.SMS,
          },
        })}>
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
        </TabPanel>
        <TabPanel {...classes({
          element: 'tab-content',
          modifiers: {
            selected: activeTab === tabs.EMAIL,
          },
        })}>
          <div {...classes('input')}>
            <Field
              {...classes('email')}
              component={Email}
              name={'emailAddress'}
            />
          </div>
        </TabPanel>
      </Tabs>
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
  )
}

export default Login;
