import { connect } from 'react-redux';
import { get } from 'lodash';
import { actions } from '../modules/actions';
import Login from '../components/Login';

const mapStateToProps = (state) => {
  const emailAddress = get(state, 'login.data.email', '');

  return {
    emailAddress,
    isActive: state.modules.active === 'login',
  };
};

const mapDispatchToProps = {
  changeEmail: actions.changeEmail,
};

function mergeProps(stateProps, dispatchProps, own) {
  return {
    ...stateProps,
    ...dispatchProps,
    smsLogin: () => {
      AccountKit.login(
        'PHONE', 
        {countryCode: countryCode, phoneNumber: phoneNumber}, // will use default values if not specified
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
          }
        },
      );
    },
    emailLogin: () => {
      AccountKit.login(
        'EMAIL',
        { emailAddress: stateProps.emailAddress },
        (response) => {
          console.log(response)
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
          }
        },
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Login)
