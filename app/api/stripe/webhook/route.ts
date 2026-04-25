import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && (plan === 'pro' || plan === 'business')) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plan,
              stripe_customer_id: String(session.customer || ''),
              stripe_subscription_id: String(session.subscription || ''),
              subscription_status: 'active',
            })
            .eq('id', userId);
        }

        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.userId;
        const plan = subscription.metadata?.plan;
        const status = subscription.status;

        await supabaseAdmin
          .from('profiles')
          .update({
            plan:
              status === 'active' && (plan === 'pro' || plan === 'business')
                ? plan
                : 'free',
            stripe_subscription_id: subscription.id,
            subscription_status: status,
          })
          .eq('id', userId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}