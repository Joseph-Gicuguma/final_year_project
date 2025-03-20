export interface AlikaEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AlikaInvitation {
  id: string;
  eventId: string;
  guestEmail: string;
  guestName: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  createdAt: string;
  updatedAt: string;
}

export interface AlikaMedia {
  id: string;
  eventId: string;
  type: 'google_photos' | 'spotify';
  url: string;
  title: string;
  createdAt: string;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'maybe'; 