import { NumberInput, Edit, SimpleForm, TextInput, ImageInput, ImageField } from 'react-admin';
import { AvatarField } from '../customFields/AvatarField.js';
import { updateSchema } from '../../validation/companies.js';
import CompanyTitle from './CompanyTitle.js';

export const CompanyEdit = () => (
  <Edit title={<CompanyTitle />}>
    <SimpleForm resolver={updateSchema}>
      <TextInput source="name" />
      <TextInput source="email" />
      <NumberInput source="latitude" />
      <NumberInput source="longitude" />
      <AvatarField source="picturePath" />
      <ImageInput source="avatar" label="Avatar">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export default CompanyEdit;
