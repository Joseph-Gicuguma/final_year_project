import { AutocompleteInput, Create, NumberInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin';
import { createSchema } from '../../validation/promo-codes.js';

const PromocodeCreate = () => (
  <Create redirect="show">
    <SimpleForm resolver={createSchema}>
      <TextInput source="promoCode" />
      <NumberInput source="discount" />
      <ReferenceInput label="Event" source="eventId" reference="events">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default PromocodeCreate;
