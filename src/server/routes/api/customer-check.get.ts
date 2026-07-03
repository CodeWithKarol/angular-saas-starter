import { defineEventHandler, getQuery, createError } from 'h3';
import { stripe } from '../../utils/stripe';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const email = query['email'] as string;

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email is required' });
    }

    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return { exists: true, customerId: customers.data[0].id };
    }

    return { exists: false, customerId: null };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
