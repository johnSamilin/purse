// @ts-check
const MobileDetect = require('mobile-detect');
import { Observable } from '../../providers/Observable';

const isOffline = navigator.connection.type === 'none' || navigator.onLine;
const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile() && !md.tablet();

const status = {
  path: 'status',
  state: {
    isOffline: new Observable(isOffline),
    isMobile: new Observable(isMobile),
  },
};

window.addEventListener('offline', () => status.state.isOffline.value = true);
window.addEventListener('online', () => status.state.isOffline.value = false);

export default status;
