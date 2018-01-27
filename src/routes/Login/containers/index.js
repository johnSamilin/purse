import { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { reduxForm } from 'redux-form';
import { actions as authActions } from 'modules/auth/actions';
import {
  accountkitAppId,
  accountkitApiVersion,
  csrf,
} from 'const';
import { notify } from 'services/helpers';
import Api from 'services/api';
import { Database, dbUrl } from 'database';
import { forms, tabs, countryCodes } from '../const';
import presenter from '../components';

@reduxForm({
  form: forms.login,
})
class Login extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: tabs.SMS,
      isLoading: false,
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.accountKitLogin = this.accountKitLogin.bind(this);
    this.initAccountKit = this.initAccountKit.bind(this);
    this.accountKitIsInitialized = __DEV__;
  }

  onTabChange(index) {
    this.setState({
      activeTab: index === 0 ? tabs.SMS : tabs.EMAIL,
    });
  }

  setIsLoading(isLoading = false) {
    this.setState({
      isLoading,
    });
  }

  initAccountKit() {
    const promise = new Promise((resolve, reject) => {
      try {
        this.accountKitIsInitialized = true;
        AccountKit.init(
          {
            appId: accountkitAppId, 
            state: csrf, 
            version: accountkitApiVersion,
            fbAppEventsEnabled: true,
            debug: __DEV__,
            redirect: 'https://purse-back.herokuapp.com/auth/success',
          }
        );
        resolve();
      } catch(er) {
        reject(er);
      }
    });
    
    return promise;
  }

  async handleLoginResult(response, params) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      const code = response.code;
      const csrf = response.state;
      try {
        const res = await this.props.getToken({
          code,
          csrf,
          ...params,
        });
        await Database.syncUsers();
        const changeEvent = Database.usersSync.complete$;
        changeEvent.subscribe(() => {
          this.props.login(res.access_token);
          this.setIsLoading(false);              
        });
      } catch(er) {
        notify('Попытка входа не удалась');
        console.error(er);
        this.setIsLoading(false);
      };
    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
        notify('Попытка входа не удалась');
        this.setIsLoading(false);
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
        notify('Попытка входа не удалась');
        this.setIsLoading(false);
    }
  }

  accountKitLogin(params) {
    this.setIsLoading(true);
    if (__DEV__) {
      return this.handleLoginResult({ status: 'PARTIALLY_AUTHENTICATED', code: null }, { phoneNumber: '9675925934', countryCode: '+7' });
    }
    AccountKit.login(
      this.state.activeTab,
      params, // will use default values if not specified
      response => this.handleLoginResult(response, params)
    );
  }
  
  async onSubmit({ emailAddress, phoneNumber, countryCode }) {
    let params = {};
    switch (this.state.activeTab) {
      case tabs.SMS:
        params = {
          countryCode,
          phoneNumber,
        };
        break;
      case tabs.EMAIL:
        params = {
          emailAddress,
        };
        break;
    }
    if (!this.accountKitIsInitialized) {
      try {
        await this.initAccountKit();
        this.accountKitLogin(params);
      } catch (er) {
        console.error(er);
        notify('Кажется, что-то пошло не так');
      }
    } else {
      this.accountKitLogin(params);
    }    
  }

  render() { 
    return presenter({
      ...this.props,
      ...this.state,
      onTabChange: this.onTabChange,
      onSubmit: this.onSubmit,
    });
  }
}

const mapStateToProps = (state) => {
  return {
    isActive: state.modules.active === 'login',
    initialValues: {
      countryCode: countryCodes[0].value,
    },
  };
};

const mapDispatchToProps = {
  login: authActions.login,
  getToken: authActions.getToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
