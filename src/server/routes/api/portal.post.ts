import { defineEventHandler, readBody, createError } from 'h3';
import { stripe } from '../../utils/stripe';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { customerId } = body;

    if (!customerId) {
      throw createError({ statusCode: 400, statusMessage: 'customerId is required' });
    }
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env['FRONTEND_URL']}/dashboard`,
    });

    return { url: portalSession.url };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
