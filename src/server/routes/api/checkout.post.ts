import { stripe } from '../../utils/stripe';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { priceId, email } = body;

    if (!priceId) {
      throw createError({ statusCode: 400, statusMessage: 'priceId is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined, // Automatyczne uzupełnienie e-maila w Stripe
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env['FRONTEND_URL']}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env['FRONTEND_URL']}/cancel`,
    });

    return { url: session.url };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
