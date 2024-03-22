import { List, TextInput } from 'react-admin';
import EventDatagrid from './EventDatagrid.js';

const filters = [<TextInput source="q" label="Search" alwaysOn />];

const EventList = () => (
  <List filters={filters}>
    <EventDatagrid />
  </List>
);

export default EventList;
