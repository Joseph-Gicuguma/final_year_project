import { AutocompleteInput, Edit, NumberInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin';
import { updateSchema } from '../../validation/promo-codes.js';
import PromocodeTitle from './PromocodeTitle.js';

const PromocodeEdit = () => (
  <Edit title={<PromocodeTitle />}>
    <SimpleForm resolver={updateSchema}>
      <TextInput source="promoCode" />
      <NumberInput source="discount" />
      <ReferenceInput label="Event" source="eventId" reference="events">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default PromocodeEdit;
