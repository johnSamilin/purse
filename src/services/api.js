import URI from 'urijs';
import { apiPaths } from 'const';
import { notify } from 'services/helpers';

const STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
};
const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
const JSON_RESPONSE_TYPE = 'application/json';

const apiRootPath = apiPaths.backend;

class Api {

  // eslint-disable-next-line class-methods-use-this
  getUserToken() {
    console.error('Replace this interface with implementation');
  }

  setUserTokenGetter(getUserToken) {
    this.getUserToken = getUserToken;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  handleUnauthorized() {
    console.error('Replace this interface with implementation');
  }

  setUnauthorizedHandler(handler) {
    this.handleUnauthorized = handler;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  handleUnexpectedError() {
    notify('Oooops!.. Something went wrong :(');
  }

  getHeaders() {
    const headers = new Headers();
    headers.append('Accept', JSON_RESPONSE_TYPE);
    const token = this.getUserToken();

    if (token) {
      headers.append('X-Auth-Token', token);
    }

    return headers;
  }

  /**
   * Checks HTTP status for errors.
   * @param  {object} response
   * @return {boolean}
   */
  checkStatusError(response) {
    const status = response.status;

    switch (status) {
      case STATUS.OK:
        return true;
      case STATUS.UNAUTHORIZED:
        this.handleUnauthorized(response.json);
        break;
      default:
        this.handleUnexpectedError();
        break;
    }

    return false;
  }

  sendRequest(method, path, payload, callback) {
    const params = {
      method,
      headers: this.getHeaders(),
    };

    if (payload && payload instanceof FormData) {
      params.body = payload;
      // NOTE:
      // Do not set 'Content-Type' - browser will automatically do this.
      // Problem is in a 'boundary'.
      // http://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    } else if (payload) {
      params.body = JSON.stringify(payload);
      params.headers.append('Content-Type', JSON_RESPONSE_TYPE);
    }

    return fetch(new Request(apiRootPath + path, params))
      .then(res => res.json().then(json => ({ ok: res.ok, status: res.status, json })))
      .then((res) => {
        if (this.checkStatusError(res)) {
          if (typeof callback === 'function') {
            callback(res.json);
          }
        }
        return res.json;
      });
  }

  doGet(path, payload, callback) {
    // Path with attached GET params
    let pathWithParams;
    // Callback, taking in account function overloads
    let resolvedCb;

    if (typeof payload === 'function') {
      // If used function overload: doGet(path, callback)
      pathWithParams = path;
      resolvedCb = payload;
    } else {
      // If used full-version, with passed GET params
      const uri = new URI(path);
      uri.setSearch(payload);

      pathWithParams = uri.toString();
      resolvedCb = callback;
    }

    return this.sendRequest(METHODS.GET, pathWithParams, null, resolvedCb);
  }

  doPost(path, payload, callback) {
    return this.sendRequest(METHODS.POST, path, payload, callback);
  }

  doPut(path, payload, callback) {
    return this.sendRequest(METHODS.PUT, path, payload, callback);
  }

  doDelete(path, payload, callback) {
    return this.sendRequest(METHODS.DELETE, path, payload, callback);
  }

  // Websockets

  /* initWS() {
    if (!this.initWsPromise) {
      this.initWsPromise = new Promise((resolve) => {
        this.socket = new SockJS('/arachne-websocket');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect(
          this.getHeaders(),
          () => {
            this.isWsInited = true;
            resolve();
          }
        );
      });
    }
    return this.initWsPromise;
  }

  doWsAction(func) {
    if (this.isWsInited) {
      func.call(this);
    } else {
      this.initWS().then(() => func.call(this));
    }
  }

  subscribe(url, cb) {
    this.doWsAction(() => {
      this.stompClient.subscribe(url, cb, this.getHeaders());
    });
  }

  unsubscribe(url) {
    this.doWsAction(() => {
      this.stompClient.unsubscribe(url);
    });
  }*/

}

const singletonApi = new Api();

export default singletonApi;
