import { Admin, Resource } from 'react-admin';
import dataProvider from './providers/dataProvider/index.js';
import authProvider from './providers/authProvider/index.js';

import companies from './components/companies/index.js';
import events from './components/events/index.js';
import { formats, themes } from './components/formats-themes/index.js';
import comments from './components/comments/index.js';
import users from './components/users/index.js';
import promoCodes from './components/promo-codes/index.js';

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} requireAuth>
    <Resource name="events" {...events} />
    <Resource name="companies" {...companies} />
    <Resource name="formats" {...formats} />
    <Resource name="themes" {...themes} />
    <Resource name="comments" {...comments} />
    <Resource name="users" {...users} />
    <Resource name="promo-codes" options={{ label: 'Promo Codes' }} {...promoCodes} />
  </Admin>
);

export default App;
