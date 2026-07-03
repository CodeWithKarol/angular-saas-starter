import { defineEventHandler } from 'h3';
import { stripe } from '../../utils/stripe';

export default defineEventHandler(async () => {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  });

  return prices.data.filter(price => 
    price.product && 
    typeof price.product !== 'string' && 
    !('deleted' in price.product) && 
    price.product.active === true
  );
});
