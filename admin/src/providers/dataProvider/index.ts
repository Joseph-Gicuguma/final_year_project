import jsonServerProvider from 'ra-data-json-server';
import { withLifecycleCallbacks } from 'react-admin';
import companiesLifecycle from './companiesLifecycle.js';
import eventsLifecycle from './eventsLifecycle.js';
import { formatsLifecycle, themesLifecycle } from './formatThemeLifecycle.js';
import commentsLifecycle from './commentsLifecycle.js';
import usersLifecycle from './usersLifecycle.js';
import promocodeLifecycle from './promocodeLifecycle.js';
import httpClient from './httpClient.js';

const baseDataProvider = jsonServerProvider(import.meta.env.VITE_SERVER_URL, httpClient);

const dataProvider = withLifecycleCallbacks(baseDataProvider, [
  companiesLifecycle,
  eventsLifecycle,
  formatsLifecycle,
  themesLifecycle,
  commentsLifecycle,
  usersLifecycle,
  promocodeLifecycle,
]);

export default dataProvider;
