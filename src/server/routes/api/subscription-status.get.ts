import { stripe } from '../../utils/stripe';
import { defineEventHandler, getQuery, createError } from 'h3';
import Stripe from 'stripe';

interface StripeSubscriptionWithPeriod extends Stripe.Subscription {
  current_period_end: number;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const email = query['email'] as string;

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email is required' });
    }
    
    // 1. Znajdź klienta po e-mailu
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return { hasActiveSubscription: false, tier: null };
    }

    const customerId = customers.data[0].id;

    // 2. Pobierz aktywne subskrypcje tego klienta (ograniczamy głębokość ekspansji)
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subs.data.length === 0) {
      return { hasActiveSubscription: false, tier: null };
    }

    // 3. Określ typ subskrypcji - pobieramy produkt bezpośrednio, aby uniknąć limitów ekspansji Stripe (maksymalnie 4 poziomy)
    const sub = subs.data[0] as StripeSubscriptionWithPeriod;
    const item = sub.items.data[0];
    const product = item.price.product;
    const productId = typeof product === 'string' ? product : product.id;
    const retrievedProduct = await stripe.products.retrieve(productId);
    const tier = retrievedProduct.name ? retrievedProduct.name.toLowerCase() : null;

    // Obsługa trybu "flexible billing mode" w Stripe - pobieramy datę okresu z elementu subskrypcji, jeśli brak na głównym obiekcie
    const currentPeriodEndTimestamp = (sub as any).current_period_end || (item as any).current_period_end;

    if (!currentPeriodEndTimestamp) {
      throw createError({ statusCode: 500, statusMessage: 'Brak daty okresu rozliczeniowego w subskrypcji' });
    }

    // Sformatuj datę kolejnego rozliczenia na język polski bezpośrednio na serwerze (np. "7 sierpnia 2026")
    const formattedNextBillingDate = new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(currentPeriodEndTimestamp * 1000));

    return {
      hasActiveSubscription: true,
      tier: tier, // 'basic' | 'standard' | 'premium'
      status: sub.status,
      currentPeriodEnd: currentPeriodEndTimestamp,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      formattedNextBillingDate: formattedNextBillingDate,
    };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
