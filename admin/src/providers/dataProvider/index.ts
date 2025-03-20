import jsonServerProvider from 'ra-data-json-server';
import { withLifecycleCallbacks } from 'react-admin';
import companiesLifecycle from './companiesLifecycle.js';
import eventsLifecycle from './eventsLifecycle.js';
import { formatsLifecycle, themesLifecycle } from './formatThemeLifecycle.js';
import commentsLifecycle from './commentsLifecycle.js';
import usersLifecycle from './usersLifecycle.js';
import promocodeLifecycle from './promocodeLifecycle.js';
import alikaLifecycle from './alikaLifecycle.js';
import { createAlikaDataProvider } from './alikaDataProvider.js';
import httpClient from './httpClient.js';

const baseDataProvider = jsonServerProvider(import.meta.env.VITE_SERVER_URL, httpClient);

// Apply the Alika-specific data provider
const alikaEnhancedDataProvider = createAlikaDataProvider(baseDataProvider);

const dataProvider = withLifecycleCallbacks(alikaEnhancedDataProvider, [
  companiesLifecycle,
  eventsLifecycle,
  formatsLifecycle,
  themesLifecycle,
  commentsLifecycle,
  usersLifecycle,
  promocodeLifecycle,
  alikaLifecycle,
]);

export default dataProvider;
