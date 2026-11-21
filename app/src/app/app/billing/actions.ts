'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { planById } from '@/lib/plans';

// TEST MODE: grants the plan's seconds with no payment. /replica-backend
// replaces this with a checkout session and a signed payment webhook.
export async function buyPlan(form: FormData) {
  const user = await requireUser();
  const plan = planById(String(form.get('plan')));
  if (!plan || plan.priceUsd === 0) return;
  const expires = new Date();
  expires.setMonth(expires.getMonth() + plan.periodMonths);
  await data.grantSeconds(user.id, plan.seconds, 'purchase', expires);
  revalidatePath('/app', 'layout');
  redirect(`/app/billing?bought=${plan.id}`);
}
