import { apiSlice } from './api-slice';

export const alikaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAlikaEvents: builder.query({
      query: () => '/alika/events',
      providesTags: ['Alika'],
    }),
    
    getAlikaEvent: builder.query({
      query: (id) => `/alika/events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Alika', id }],
    }),
    
    createAlikaEvent: builder.mutation({
      query: (data) => ({
        url: '/alika/events',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Alika'],
    }),
    
    updateAlikaEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/alika/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alika', id }],
    }),
    
    deleteAlikaEvent: builder.mutation({
      query: (id) => ({
        url: `/alika/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alika'],
    }),
    
    sendInvitations: builder.mutation({
      query: ({ id, invitations }) => ({
        url: `/alika/events/${id}/invitations`,
        method: 'POST',
        body: { invitations },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alika', id }],
    }),
    
    respondToInvitation: builder.mutation({
      query: ({ id, status }) => ({
        url: `/alika/invitations/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['AlikaInvitation'],
    }),
    
    addMediaLink: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/alika/events/${id}/media`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alika', id }],
    }),
    
    // Admin endpoints
    adminGetAllEvents: builder.query({
      query: () => '/alika/admin/events',
      providesTags: ['Alika'],
    }),
    
    adminDeleteEvent: builder.mutation({
      query: (id) => ({
        url: `/alika/admin/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alika'],
    }),
  }),
});

export const {
  useGetAlikaEventsQuery,
  useGetAlikaEventQuery,
  useCreateAlikaEventMutation,
  useUpdateAlikaEventMutation,
  useDeleteAlikaEventMutation,
  useSendInvitationsMutation,
  useRespondToInvitationMutation,
  useAddMediaLinkMutation,
  useAdminGetAllEventsQuery,
  useAdminDeleteEventMutation,
} = alikaApiSlice; 