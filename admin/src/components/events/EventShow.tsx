import {
  BooleanField,
  ChipField,
  DateField,
  NumberField,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  RichTextField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin';
import { PosterField } from '../customFields/PosterField.js';
import EventTitle from './EventTitle.js';
import CommentsDatagrid from '../comments/CommentsDatagrid.js';

const EventShow = () => (
  <Show title={<EventTitle />}>
    <TabbedShowLayout>
      <Tab label="Summary">
        <SimpleShowLayout>
          <NumberField source="id" />
          <TextField source="name" />
          <ReferenceField label="Company" source="companyId" reference="companies">
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="price" />
          <NumberField source="ticketsAvailable" />
          <NumberField source="latitude" />
          <NumberField source="longitude" />
          <ReferenceField label="Format" source="formatId" reference="formats">
            <ChipField source="name" />
          </ReferenceField>
          <ReferenceField label="Theme" source="themeId" reference="themes">
            <ChipField source="name" />
          </ReferenceField>
          <DateField label="Publication date" source="publishDate" showTime />
          <DateField label="Date" source="date" showTime />
          <DateField label="To Date" source="to_date" showTime />
          <BooleanField label="Public" source="isPublic" />
          <BooleanField label="Notifications" source="isNotificationsOn" />
          <RichTextField source="description" />
          <PosterField source="picturePath" label="Poster" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="Comments" path="comments">
        <ReferenceManyField reference="comments" target="eventId" pagination={<Pagination />} label={false}>
          <CommentsDatagrid />
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default EventShow;
