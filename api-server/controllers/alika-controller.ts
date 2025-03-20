import { Request, Response } from 'express';
import prisma from '../lib/prisma/prisma-client.js';
import { ApiError } from '../utils/api-error.js';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const events = await prisma.alikaEvent.findMany({
      where: {
        hostId: userId,
        isActive: true,
      },
      include: {
        invitations: {
          select: {
            id: true,
            guestName: true,
            guestEmail: true,
            status: true,
          },
        },
        mediaLinks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const event = await prisma.alikaEvent.findFirst({
      where: {
        id: Number(id),
        hostId: userId,
      },
      include: {
        invitations: true,
        mediaLinks: true,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    res.json({ event });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error fetching Alika event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const { title, description, date, time, location } = req.body;
    
    const event = await prisma.alikaEvent.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        hostId: userId,
        isActive: true,
      },
    });
    
    res.status(201).json({ event });
  } catch (error) {
    console.error('Error creating Alika event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const { title, description, date, time, location, isActive } = req.body;
    
    const event = await prisma.alikaEvent.findFirst({
      where: {
        id: Number(id),
        hostId: userId,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const updatedEvent = await prisma.alikaEvent.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        location,
        isActive,
      },
    });
    
    res.json({ event: updatedEvent });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error updating Alika event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const event = await prisma.alikaEvent.findFirst({
      where: {
        id: Number(id),
        hostId: userId,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    await prisma.alikaEvent.delete({
      where: {
        id: Number(id),
      },
    });
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error deleting Alika event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const sendInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const { invitations } = req.body;
    
    const event = await prisma.alikaEvent.findFirst({
      where: {
        id: Number(id),
        hostId: userId,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const createdInvitations = await prisma.alikaInvitation.createMany({
      data: invitations.map((invitation: any) => ({
        eventId: Number(id),
        guestName: invitation.name,
        guestEmail: invitation.email,
        status: 'pending',
      })),
    });
    
    // Here you would also add email sending logic
    
    res.status(201).json({ success: true, count: createdInvitations.count });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error sending invitations:', error);
    res.status(500).json({ error: 'Failed to send invitations' });
  }
};

export const respondToInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'declined', 'maybe'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    
    const invitation = await prisma.alikaInvitation.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!invitation) {
      res.status(404).json({ error: 'Invitation not found' });
      return;
    }
    
    const updatedInvitation = await prisma.alikaInvitation.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status,
      },
    });
    
    res.json({ invitation: updatedInvitation });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error responding to invitation:', error);
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};

export const addMediaLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const { type, url, title } = req.body;
    
    const event = await prisma.alikaEvent.findFirst({
      where: {
        id: Number(id),
        hostId: userId,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    const mediaLink = await prisma.alikaMedia.create({
      data: {
        eventId: Number(id),
        type,
        url,
        title,
      },
    });
    
    res.status(201).json({ mediaLink });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error adding media link:', error);
    res.status(500).json({ error: 'Failed to add media link' });
  }
};

// Admin endpoints
export const adminGetAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    
    const events = await prisma.alikaEvent.findMany({
      include: {
        host: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
          },
        },
        invitations: {
          select: {
            id: true,
            guestName: true,
            guestEmail: true,
            status: true,
          },
        },
        mediaLinks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json({ events });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error fetching all Alika events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const adminDeleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    
    const event = await prisma.alikaEvent.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    
    await prisma.alikaEvent.delete({
      where: {
        id: Number(id),
      },
    });
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error deleting Alika event (admin):', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
}; 