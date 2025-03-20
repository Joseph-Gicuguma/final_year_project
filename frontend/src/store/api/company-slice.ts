import { CompaniesParam, CompaniesResponse, Company, StripeLink, SubscriptionResponse } from '~/types/company';
import { apiSlice } from './api-slice';
import type { ICreate, IUpdate } from '~/validation/companies';

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: ({ page, limit, orderDirection, byField }) => {
        const params = new URLSearchParams();
        page && params.append('page', page);
        limit && params.append('limit', limit);
        orderDirection && params.append('orderDirection', orderDirection);
        byField && params.append('byField', byField);
        
        return {
          url: '/api/companies',
          params
        };
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Company', id })), { type: 'Company', id: 'LIST' }]
          : [{ type: 'Company', id: 'LIST' }],
    }),
    getCompany: builder.query<Company, number>({
      query: (id) => `/api/companies/${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'Company' as const, id: arg }],
    }),
    createCompany: builder.mutation<Company, ICreate>({
      query: (body) => ({
        url: '/api/companies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Company'],
    }),
    createStripeAccount: builder.mutation<StripeLink, { id: number }>({
      query: ({ id }) => ({
        url: `/api/companies/${id}/stripe-account`,
        method: 'POST',
      }),
    }),
    getStripeAccount: builder.query<StripeLink, { id: number }>({
      query: ({ id }) => ({
        url: `/api/companies/${id}/stripe-account`,
        method: 'GET',
      }),
    }),
    updateCompany: builder.mutation<Company, IUpdate & Pick<Company, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/api/companies/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Company', id: arg.id }],
    }),
    deleteCompany: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    updateCompanyAvatar: builder.mutation<Company, { form: FormData } & Pick<Company, 'id'>>({
      query: ({ id, form }) => ({
        url: `/api/companies/${id}/avatar`,
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Company', id: arg.id }],
    }),
    deleteCompanyAvatar: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/companies/${id}/avatar`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Company', id: arg }],
    }),
    subscribe: builder.mutation<SubscriptionResponse, number>({
      query: (id) => ({
        url: `/api/me/companies/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _err, arg) => [{ type: 'CompanySubscribers', id: arg }],
    }),
    unsubscribe: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/me/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, arg) => [{ type: 'CompanySubscribers', id: arg }],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useLazyGetCompaniesQuery,
  useGetCompanyQuery,
  useLazyGetCompanyQuery,
  useCreateCompanyMutation,
  useCreateStripeAccountMutation,
  useLazyGetStripeAccountQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyAvatarMutation,
  useDeleteCompanyAvatarMutation,
  useSubscribeMutation,
  useUnsubscribeMutation,
} = extendedApiSlice;
