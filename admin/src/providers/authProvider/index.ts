import checkAuth from './checkAuth.js';
import checkError from './checkError.js';
import getIdentity from './getIdentity.js';
import login from './login.js';
import logout from './logout.js';

const authProvider = {
  login,
  checkError,
  checkAuth,
  logout,
  getIdentity,
  getPermissions: () => {
    return Promise.resolve();
  },
};

export default authProvider;
