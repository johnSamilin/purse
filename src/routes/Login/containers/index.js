import { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { reduxForm } from 'redux-form';
import { actions as authActions } from 'modules/auth/actions';
import { forms, tabs } from '../const';
import presenter from '../components';

@reduxForm({
  form: forms.login,
})
class Login extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: tabs.SMS,
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onTabChange(index) {
    this.setState({
      activeTab: index === 0 ? tabs.SMS : tabs.EMAIL,
    });
  }
  
  onSubmit({ emailAddress, phoneNumber, countryCode }) {
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
    AccountKit.login(
      this.state.activeTab,
      params, // will use default values if not specified
      (response) => {
        if (response.status === "PARTIALLY_AUTHENTICATED") {
          const code = response.code;
          const csrf = response.state;
          // Send code to server to exchange for access token
        }
        else if (response.status === "NOT_AUTHENTICATED") {
          // handle authentication failure
        }
        else if (response.status === "BAD_PARAMS") {
          // handle bad parameters
        } else {
          this.props.login(response.status);
        }
      },
    );
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
  };
};

const mapDispatchToProps = {
  login: authActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
