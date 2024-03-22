import { User } from '@prisma/client';
import { CronJob } from 'cron';
import { HOURS_BEFORE_EVENT } from '../consts/default.js';
import templates from '../consts/email.js';
import prisma from '../lib/prisma.js';
import { Email } from '../services/index.js';
import { getEventDate } from '../services/event.js';
import { compareDates } from '../utils/compare-dates.js';
import subtractHours from '../utils/subtract-hours.js';

const scheduleEventReminder = (tickDate: Date, eventId: number) => {
  new CronJob(
    tickDate,
    async () => {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { visitors: { include: { user: true } }, company: true },
      });

      if (!event || !event.visitors.length) {
        return;
      }

      const { date: eventDate, name: eventName } = event;
      const visitors = event.visitors.map((visitor) => visitor.user);

      const sendRemindersDate = subtractHours(eventDate, HOURS_BEFORE_EVENT);

      if (!compareDates(tickDate, sendRemindersDate)) {
        sendReminders(eventName, getEventDate(eventDate), eventId, visitors);
      }
    },
    null,
    true,
  );
};

const sendReminders = async (
  eventName: string,
  eventDate: string,
  eventId: number,
  visitors: User[],
) => {
  visitors.forEach((visitor) => {
    Email.sendMail(visitor.email, templates.EVENT_REMINDER, {
      eventName,
      eventDate,
      hoursBeforeEvent: HOURS_BEFORE_EVENT,
      eventId,
    });
  });
};

export { scheduleEventReminder };
