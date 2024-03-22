import UserCreate from './UserCreate.js';
import UserEdit from './UserEdit.js';
import UserList from './UserList.js';
import UserShow from './UserShow.js';

const resource = {
  list: UserList,
  create: UserCreate,
  show: UserShow,
  edit: UserEdit,
};

export default resource;
