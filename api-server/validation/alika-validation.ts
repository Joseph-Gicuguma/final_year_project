import { object, string, array, date, boolean } from 'zod';

export const createEventSchema = object({
  body: object({
    title: string({ required_error: 'Title is required' })
      .min(3, 'Title must be at least 3 characters')
      .max(255, 'Title must be at most 255 characters'),
    description: string({ required_error: 'Description is required' }),
    date: string({ required_error: 'Date is required' }),
    time: string({ required_error: 'Time is required' })
      .max(10, 'Time must be at most 10 characters'),
    location: string({ required_error: 'Location is required' })
      .max(255, 'Location must be at most 255 characters'),
  }),
});

export const updateEventSchema = object({
  body: object({
    title: string()
      .min(3, 'Title must be at least 3 characters')
      .max(255, 'Title must be at most 255 characters')
      .optional(),
    description: string().optional(),
    date: string().optional(),
    time: string()
      .max(10, 'Time must be at most 10 characters')
      .optional(),
    location: string()
      .max(255, 'Location must be at most 255 characters')
      .optional(),
    isActive: boolean().optional(),
  }),
  params: object({
    id: string().refine((val: string) => !isNaN(Number(val)), {
      message: 'ID must be a number',
    }),
  }),
});

export const invitationsSchema = object({
  body: object({
    invitations: array(
      object({
        name: string({ required_error: 'Guest name is required' })
          .max(255, 'Guest name must be at most 255 characters'),
        email: string({ required_error: 'Guest email is required' })
          .email('Invalid email format')
          .max(255, 'Guest email must be at most 255 characters'),
      })
    ).nonempty('At least one invitation is required'),
  }),
  params: object({
    id: string().refine((val: string) => !isNaN(Number(val)), {
      message: 'ID must be a number',
    }),
  }),
});

export const invitationResponseSchema = object({
  body: object({
    status: string().refine((val: string) => ['accepted', 'declined', 'maybe'].includes(val), {
      message: 'Status must be one of: accepted, declined, maybe',
    }),
  }),
  params: object({
    id: string().refine((val: string) => !isNaN(Number(val)), {
      message: 'ID must be a number',
    }),
  }),
});

export const mediaLinkSchema = object({
  body: object({
    type: string().refine((val: string) => ['google_photos', 'spotify'].includes(val), {
      message: 'Type must be one of: google_photos, spotify',
    }),
    url: string({ required_error: 'URL is required' })
      .url('Invalid URL format')
      .max(512, 'URL must be at most 512 characters'),
    title: string({ required_error: 'Title is required' })
      .max(255, 'Title must be at most 255 characters'),
  }),
  params: object({
    id: string().refine((val: string) => !isNaN(Number(val)), {
      message: 'ID must be a number',
    }),
  }),
}); 