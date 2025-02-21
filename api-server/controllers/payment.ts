import { Event, User } from '@prisma/client';
import { Request, Response } from 'express';
import EventService from '../services/event.js';
import stripe, { Stripe, STRIPE_WEBHOOK_KEY } from '../lib/stripe.js';
import { STRIPE_PAYMENT_OPTIONS } from '../consts/payment.js';
import EventSubscription, { IEventMeta } from '../services/event-subscription.js';
import logger from '../lib/logger.js';
import prisma from '../lib/prisma.js';
import CompanyService from '../services/company.js';

const promoCode = prisma.promoCode;

type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

const getDiscount = async (eventId: number, curPromoCode: string) => {
  if (!curPromoCode) {
    return 0;
  }

  const found = await promoCode.findFirst({
    where: {
      promoCode: curPromoCode,
      eventId,
    },
  });
  return found ? found.discount : 0;
};

const stripeLineItem = (event: Event, discount: number): StripeLineItem => ({
  price_data: {
    currency: 'usd',
    product_data: {
      name: `Ticket for the '${event.name}' event`,
    },
    unit_amount: Number(event.price) * (100 - discount),
  },
  quantity: 1,
});

const createAccount = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);

  const company = await CompanyService.findOneOrThrow(companyId);

  if (!company.stripeId) {
    const account = await stripe.accounts.create({
      type: 'express',
      default_currency: 'usd',
    });
    const updated = await CompanyService.update(companyId, {
      stripeId: account.id,
    });
    company.stripeId = updated.stripeId as string;
  }

  const accountLink = await stripe.accountLinks.create({
    account: company.stripeId,
    refresh_url: process.env.CLIENT_URL,
    return_url: process.env.CLIENT_URL,
    type: 'account_onboarding',
  });

  res.json({ url: accountLink.url });
};

const getAccountLink = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);

  const stripeId = await CompanyService.isStripeConnected(companyId);
  await CompanyService.checkAccountOrThrow(stripeId);

  const loginLink = await stripe.accounts.createLoginLink(stripeId);
  res.json({ url: loginLink.url });
};

const createSession = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  const user = req.user as User;
  const isVisible = String(req.body.isVisible);

  const event = await EventService.findEventIfExists(eventId);
  await EventSubscription.check(event.id, user.id);

  if (Number(event.price) === 0) {
    const meta: IEventMeta = {
      metadata: {
        isVisible,
        eventId: String(eventId),
        userId: String(user.id),
      },
    };
    await EventSubscription.handleWith(meta);
    res.json({ sessionId: -1 });
    return;
  }

  const stripeId = await CompanyService.isStripeConnected(event.companyId);
  await CompanyService.checkAccountOrThrow(stripeId);

  const discount = await getDiscount(eventId, req.body.promoCode);

  const params: Stripe.Checkout.SessionCreateParams = {
    ...STRIPE_PAYMENT_OPTIONS,
    line_items: [stripeLineItem(event, discount)],
    customer_email: user.email,
    payment_intent_data: {
      metadata: { eventId, userId: user.id, isVisible },
      transfer_data: {
        destination: stripeId,
      },
    },
  };

  const session = await stripe.checkout.sessions.create(params);

  res.json({ sessionId: session.id });
}

// const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string | string[];

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_KEY);
//   } catch (err) {
//     throw new Error(`Stripe webhook error: ${err}`);
//   }

//   if (event.type === 'payment_intent.succeeded') {
//     const meta = event.data.object as IEventMeta;
//     await EventSubscription.handleWith(meta);
//     logger.info('Your payment was successful');
//   }

//   if (event.type === 'account.updated') {
//     if (!event.account) {
//       return res.sendStatus(500);
//     }
//     const account = await stripe.accounts.retrieve(event.account);
//     if (!account.details_submitted) {
//       logger.error('Not all account information has been completed yet.');
//       return res.sendStatus(500);
//     }
//   }

//   res.sendStatus(200);
// };

const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'] as string | string[];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_KEY);
    } catch (err) {
      res.status(400).json({ error: `Stripe webhook error: ${err}` });
      return;
    }

    if (event.type === 'payment_intent.succeeded') {
      const meta = event.data.object as IEventMeta;
      await EventSubscription.handleWith(meta);
      logger.info('Your payment was successful');
    }

    if (event.type === 'account.updated') {
      if (!event.account) {
        res.sendStatus(500);
        return;
      }
      const account = await stripe.accounts.retrieve(event.account);
      if (!account.details_submitted) {
        logger.error('Not all account information has been completed yet.');
        res.sendStatus(500);
        return;
      }
    }

    res.sendStatus(200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export { createAccount, getAccountLink, createSession, stripeWebhook };
