import {
  accountkitAppId,
  accountkitApiVersion,
  csrf,
} from 'const';
import { notify } from 'services/helpers';
import { Database } from 'database';
import { tabs, path } from '../const';
import presenter from '../components';
import { Page } from '../../../providers/Page';
import { actions } from '../../../modules/auth/actions';

export class Login extends Page {
  constructor() {
    super();
    this.state = {
      ...super.state,
      activeTab: tabs.SMS,
      isLoading: false,
    };
    this.path = path;
    this.values = {
      countryCode: null,
      phoneNumber: null,
      emailAddress: null,
    };
    
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.accountKitLogin = this.accountKitLogin.bind(this);
    this.initAccountKit = this.initAccountKit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
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

  async login(token) {
    this.setIsLoading(true);
    await Database.syncUsers();
    Database.usersSync.complete$.subscribe((isComplete) => {
      if (isComplete !== false) {
        actions.login(token);
        this.setIsLoading(false);
      }
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
    if (response.status === 'PARTIALLY_AUTHENTICATED') {
      const code = response.code;
      const csrf = response.state;
      try {
        const res = await actions.getToken({
          code,
          csrf,
          ...params,
        });
        this.login(res.access_token);
      } catch(er) {
        notify('Попытка входа не удалась');
        console.error(er);
      };
    }
    else if (response.status === 'NOT_AUTHENTICATED') {
      // handle authentication failure
        notify('Попытка входа не удалась');
    }
    else if (response.status === 'BAD_PARAMS') {
      // handle bad parameters
        notify('Попытка входа не удалась');
    }
    this.setIsLoading(false);
  }

  accountKitLogin(params) {
    this.setIsLoading(true);
    if (__DEV__) {
      return this.handleLoginResult({ status: 'PARTIALLY_AUTHENTICATED', code: null }, { phoneNumber: 'test-user', countryCode: '+7' });
    }
    AccountKit.login(
      this.state.activeTab,
      params, // will use default values if not specified
      response => this.handleLoginResult(response, params)
    );
  }

  async onSubmit(event) {
    event.preventDefault();
    if (__DEV__) {
      this.login('testen');
      return false;
    }

    
    let params = {};
    const { emailAddress, phoneNumber, countryCode } = this.values;
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

  onInputChange(field, event) {
    this.values[field] = event.target.value;
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      getPageClasses: this.getPageClasses,
      onTabChange: this.onTabChange,
      onSubmit: this.onSubmit,
      onInputChange: this.onInputChange,
    });
  }
}
