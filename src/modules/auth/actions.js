import Api from 'services/api';
import { apiPaths } from 'routes/Login/const';
import { GlobalStore } from '../../store/globalStore';

function getToken({ code, csrf, countryCode, phoneNumber, emailAddress }) {
  return () => Api.doPost(
    apiPaths.getToken(),
    {
      code,
      csrf,
      phone: `${countryCode}${phoneNumber}`,
      email: emailAddress,
    }
  );
}

function login(token) {
  GlobalStore.modules.auth.token.value = token;
  GlobalStore.modules.auth.isLoggedIn.value = true;
}

function logout() {
  GlobalStore.modules.auth.token.value = null;
  GlobalStore.modules.auth.isLoggedIn.value = null;
}

export const actions = {
  getToken,
  login,
  logout,
};
