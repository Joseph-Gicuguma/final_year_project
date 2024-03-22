import { Edit, SimpleForm, TextInput } from 'react-admin';
import { updateSchema } from '../../validation/comments.js';
import CommentTitle from './CommentTitle.js';

const CommentEdit = () => (
  <Edit title={<CommentTitle />}>
    <SimpleForm resolver={updateSchema}>
      <TextInput source="content" fullWidth multiline />
    </SimpleForm>
  </Edit>
);

export default CommentEdit;
