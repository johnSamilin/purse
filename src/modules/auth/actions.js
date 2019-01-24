// @ts-check
import { apiPaths } from '../../routes/Login/const';
import Api from '../../services/api';
import { GlobalStore } from '../../store/globalStore';

export const LS_TOKEN_KEY = 'pursetoken';

function getToken({ code, csrf, countryCode, phoneNumber, emailAddress }) {
  return Api.doPost(
    apiPaths.getToken(),
    {
      code,
      csrf,
      phone: `${countryCode}${phoneNumber}`,
      email: emailAddress,
    }
  );
}

function restoreToken() {
  return localStorage.getItem(LS_TOKEN_KEY);
}

function login(token) {
  GlobalStore.modules.auth.token.value = token;
  GlobalStore.modules.auth.isLoggedIn.value = true;
  localStorage.setItem(LS_TOKEN_KEY, token);
}

function logout() {
  GlobalStore.modules.auth.token.value = null;
  GlobalStore.modules.auth.isLoggedIn.value = null;
  localStorage.removeItem(LS_TOKEN_KEY);
}

export const actions = {
  getToken,
  login,
  logout,
  restoreToken,
};
