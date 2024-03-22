import EventCreate from './EventCreate.js';
import EventEdit from './EventEdit.js';
import EventList from './EventList.js';
import EventShow from './EventShow.js';

const resource = {
  list: EventList,
  show: EventShow,
  create: EventCreate,
  edit: EventEdit,
};

export default resource;
